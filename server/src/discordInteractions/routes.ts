import { FastifyInstance } from 'fastify'
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

// These are the handlers for 'things that happen in discord'. Someone uses our app's commands, or context
// menu action, it makes a request here.
export default function discordInteractionsHandler(
  server: FastifyInstance,
  options,
  done
) {
  // Test route
  server.get('', async (req, reply) => {
    const resp = await discordApi.getUsersFromRole('')
    reply.code(200).send(resp)
    return resp
  })
  // Github test
  server.get('/github/add', async (req, reply) => {
    const resp = await githubApi.addUserToTeam(
      'rollie42',
      '01_testing_create_team'
    )
    reply.code(200).send(resp)
    return resp
  })
  server.get('/github/remove', async (req, reply) => {
    const resp = await githubApi.removeUserFromTeam(
      'rollie42',
      '01_testing_create_team'
    )
    reply.code(200).send(resp)
    return resp
  })
  server.get('/github/createTeam', async (req, reply) => {
    const resp = await githubApi.createTeam('001_badgers')
    reply.code(200).send(resp)
    return resp
  })
  server.get('/github/deleteTeam', async (req, reply) => {
    const resp = await githubApi.deleteTeam('001_badgers')
    reply.code(200).send(resp)
    return resp
  })
  server.get('/github/createRepo', async (req, reply) => {
    const resp = await githubApi.createRepoForTeam('Test Proj', '001_badgers')
    reply.code(200).send(resp)
    return resp
  })
  server.get('/github/deleteRepo', async (req, reply) => {
    const resp = await githubApi.deleteRepo('Test-Proj')
    reply.code(200).send(resp)
    return resp
  })
  // Helper route - register all our commands with discord (only do this when you update the commands)
  server.get('/register', async (req, reply) => {
    const res = await discordAppApi.AddAllCommands()
    reply.code(200).send(res)
  })
  // Test route for firebase interaction
  server.get('/firebase', async (req, reply) => {
    const testCol = firestoreDb.collection('test')
    const d2 = await testCol.listDocuments()
    const ret = []
    for (const docRef of d2) {
      const doc = await docRef.get()
      const data = doc.data()
      console.log(data)
      ret.push(data)
    }
    reply.code(200).send(ret)
  })
  // The meat of this file - this does the verification and then handles the command
  server.post('/', async (req, res) => {
    console.log('INSIDE SERVER POST')
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
    const invoker = body.member.user.id
    const invokerRoles = body.member.roles
    if (body.type === InteractionType.ApplicationCommand) {
      if (body.data.name === 'foo') {
        res.status(200).send({
          type: 4,
          data: { content: 'bar' },
        })
        return
      }

      // Handle /leaveteam Command
      if (body.data.name === 'leaveteam') {
        const team = teamList.find((t) =>
          invokerRoles.includes(t.discordTeamId)
        ) // We'll just assume they aren't on multiple
        if (!team) {
          res.status(200).send({
            type: 4,
            data: { content: "You aren't on a team" },
          })
        } else {
          await discordApi.removeUserFromTeams(invoker, [
            team.discordTeamId,
            // If they are leaving their team, they don't keep team lead role
            hackWeeklyDiscord.specialRoles.teamLead,
          ])
          res.status(200).send({
            type: 4,
            flags: 64,
            data: { content: `Removed from ${team.name}` },
          })
        }
      } else if (body.data.name === 'Recruit') {
        const data = (body as APIUserApplicationCommandInteraction).data
        if (!invokerRoles.includes(hackWeeklyDiscord.specialRoles.teamLead)) {
          res.status(200).send({
            type: 4,
            data: { content: "You aren't a team lead" },
          })
          return
        }
        const invokerTeam = teamList.find((t) =>
          invokerRoles.includes(t.discordTeamId)
        )
        if (!invokerTeam) {
          // We should never be in this case where someone is a team lead but not on a team, but we'll
          // check anyway
          res.status(200).send({
            type: 4,
            data: { content: "You aren't on a team" },
          })
          return
        }
        const userRoles = await discordApi.getUserRoles(data.target_id)
        const userTeam = teamList.find((t) =>
          userRoles.includes(t.discordTeamId)
        )
        if (userTeam) {
          res.status(200).send({
            type: 4,
            data: {
              content:
                'User is already on a team - ask them to /leaveteam first',
            },
          })
          return
        }

        // Checks all done - add the user
        await discordApi.addUserToTeam(
          data.target_id,
          invokerTeam.discordTeamId
        )
        res.status(200).send({
          type: 4,
          data: { content: 'User recruited!' },
        })
      }
    } else if (body.type === InteractionType.MessageComponent) {
      // Handle interaction triggered by message components
    }
    console.log('404')
    res.status(404).send('unknown command')
  })

  done()
}
