import { FastifyInstance, FastifyReply } from 'fastify'
import { verifyKey } from 'discord-interactions'
import { discordRestApi } from '../discord/discordRestApi.js'
import {
  hackWeeklyDiscord,
  rollieId,
  testUserId,
} from '../discord/hackWeeklyDiscord.js'
import { discordAppApi } from '../admin/discordAppApi.js'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { teamList } from '../teams.js'
import { discordApi } from '../discord/discordApi.js'
import { githubApi } from '../github/githubApi.js'
import {
  APIInteraction,
  APIInteractionResponse,
  APIUserApplicationCommandInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { firestoreDb } from '../firebase.js'
import { currentHost } from '../shared.js'

import { TeamT, UserT } from 'shared'
import { DateTime } from 'luxon'
import { firebaseApi } from '../firebase/firebaseApi.js'
import { commands } from '../admin/discordApp.js'

const interactionReply = (message: string, resp: FastifyReply) => {
  resp.status(200).send({
    type: 4,
    data: { content: message, flags: 64 },
  })
}

// These are the handlers for 'things that happen in discord'. Someone uses our app's commands, or context
// menu action, it makes a request here.
export default function discordInteractionsHandler(
  server: FastifyInstance,
  options,
  done
) {
  // Helper route - register all our commands with discord (only do this when you update the commands)
  server.get('/register', async (req, reply) => {
    const res = await discordAppApi.AddAllCommands()
    reply.code(200).send(res)
  })
  // The meat of this file - this does the verification and then handles the command
  server.post('/', async (req, res) => {
    const body = req.body as APIInteraction
    const sig = req.headers['x-signature-ed25519'] as string
    const ts = req.headers['x-signature-timestamp'] as string
    console.log(req.headers)
    const appPublicKey =
      '5cb905f19d79c1c76e6fe34046923e514cb0a79277c5c32868b71c3bcd0e4646'
    console.log(sig)
    console.log(ts)
    console.log(req.rawBody)

    const isValidRequest = verifyKey(req.rawBody, sig, ts, appPublicKey)
    console.log('Check verify')
    if (!isValidRequest) {
      console.log('Unverified')
      res.status(401).send('invalid request signature')
      return
    }

    // Replying to ping (requirement 2.)
    if (body.type === InteractionType.Ping) {
      const resp: APIInteractionResponse = {
        type: InteractionResponseType.Pong,
      }
      res.status(200).send(resp)
      return
    }

    // See https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
    // Resolve the calling user
    const member = body.member
    const invoker = member.user.id
    const invokerRoles = member.roles
    const options = (body.data as any).options
    if (body.type === InteractionType.ApplicationCommand) {
      for (const command of commands) {
        if (body.data.name === command.command) {
          const result = await command.execute(body)
          if (result.error) {
            interactionReply(`Command failed with: '${result.error}'`, res)
          } else {
            interactionReply(`Success: ${result.message}`, res)
          }
          return
        }
      }
      // This doesn't fit into the other command structure easily, so we'll just keep
      // it here for now
      if (body.data.name === 'register') {
        // Register new user
        const githubId = options.find((o) => o.name === 'githubid')?.value

        if (!githubId) {
          interactionReply('Supplied github id invalid', res)
          return
        }

        const users = await firebaseApi.getUsers()

        const existingUser = users.find(
          (u) => u.discordId === invoker || u.githubId === githubId
        )
        if (existingUser) {
          interactionReply("You're already registered!", res)
          return
        }

        // Derive team from discord
        const teams = await firebaseApi.getTeams()
        const curTeam = teams.find((t) => invokerRoles.includes(t.discordRole))
        const teamLead = invokerRoles.includes(
          hackWeeklyDiscord.specialRoles.teamLead
        )

        let experience = 2
        if (invokerRoles.includes(hackWeeklyDiscord.specialRoles.beginner)) {
          experience = 1
        } else if (
          invokerRoles.includes(hackWeeklyDiscord.specialRoles.advanced)
        ) {
          experience = 3
        }

        let timezone: any = 'NA'
        if (invokerRoles.includes(hackWeeklyDiscord.specialRoles.eu)) {
          timezone = 'EU'
        } else if (invokerRoles.includes(hackWeeklyDiscord.specialRoles.asia)) {
          timezone = 'Asia'
        }
        const newUser: UserT = {
          id: '',
          discordId: invoker,
          experience,
          githubId,
          name: member.user.username,
          tech: {},
          team: curTeam?.id,
          teamLead,
          lft: null,
          timezone,
          admin: invokerRoles.includes(hackWeeklyDiscord.specialRoles.admin),
        }

        await firebaseApi.addUser(newUser)

        interactionReply(`User created!`, res)
        return
      }
    }
    console.log(`Unknown command ${body.data}`)

    res.status(404).send('unknown command')
  })

  done()
}
