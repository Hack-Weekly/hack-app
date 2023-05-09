import { FastifyInstance, FastifyReply } from 'fastify'
import { verifyKey } from 'discord-interactions'
import { discordRestApi } from '../discord/discordRestApi.js'
import { hackWeeklyDiscord, rollieId } from '../discord/hackWeeklyDiscord.js'
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
  server.get('/register/:command', async (req, reply) => {
    const { command } = req.params as any
    const res = await discordAppApi.AddCommandWithName(command)
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
    if (body.type === InteractionType.ApplicationCommand) {
      for (const command of commands) {
        if (body.data.name === command.command) {
          console.log(`Found command with name '${command.command}'`)
          const result = await command.execute(body)
          if (result.error) {
            interactionReply(`Command failed with: '${result.error}'`, res)
          } else {
            interactionReply(`Success: ${result.message}`, res)
          }
          return
        }
      }
    }
    console.log(`Unknown command ${body.data}`)

    res.status(404).send('unknown command')
  })

  done()
}
