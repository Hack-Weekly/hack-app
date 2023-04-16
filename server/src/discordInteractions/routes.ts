import { FastifyInstance } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { generateId } from '../utils/generateId.js'
import { isValidEmail, isValidPassword } from '../utils/validators.js'
import { InteractionType, verifyKey } from 'discord-interactions'
import { discordRestApi } from '../discord/discordRestApi.js'
import { hackWeeklyDiscord, rollieId, testUserId } from '../discord/hackWeeklyDiscord.js'
import { discordAppApi } from '../admin/discordAppApi.js'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { teamList } from '../teams.js'
import { discordApi } from '../discord/discordApi.js'

const firebaseApp = initializeApp()
const db = getFirestore(firebaseApp)

// These are the handlers for 'things that happen in discord'. Someone uses our app's commands, or context
// menu action, it makes a request here.
export default function discordInteractionsHandler(
  server: FastifyInstance,
  options,
  done
) {
  // Test route
  server.get('', async (req, reply) => {
    const resp = await discordApi.getUsersFromRole("")
    reply.code(200).send(resp)
    return(resp)
  })
  // Helper route - register all our commands with discord (only do this when you update the commands)
  server.get('/register', async (req, reply) => {
    const res = await discordAppApi.AddAllCommands()
    reply.code(200).send(res)
  })
  // Test route for firebase interaction
  server.get('/firebase', async (req, reply) => {
    const testCol = db.collection('test')
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
  server.post('', async (req, res) => {
    const body = req.body as any
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
    if (body.type == InteractionType.PING) {
      res.status(200).send({ type: InteractionType.PING })
      return
    }

    // Handle /foo Command
    // See https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
    if (body.type === InteractionType.APPLICATION_COMMAND) {

      if (body.data.name === 'foo') {
        res.status(200).send({
          type: 4,
          data: { content: 'bar' },
        })
        return
      }

      // Handle /leaveteam Command
      if (body.data.name === 'leaveteam') {
        const roles = body.member.roles

      const team = teamList.find((t) => roles.includes(t.discordTeamId)) // We'll just assume they aren't on multiple
      if (!team) {
        res.status(200).send({
          type: 4,
          data: { content: "You aren't on a team" },
        })
      } else {
        await discordApi.removeUserFromTeam(
          body.member.user.id,
          team.discordTeamId
        )
        res.status(200).send({
          type: 4,
          flags: 64,
          data: { content: `Removed from ${team.name}` },
        })
      }
    }
    if (body.type === InteractionType.MESSAGE_COMPONENT) {
      // Handle interaction triggered by message components
    }
  }
    console.log('404')
    res.status(404).send('unknown command')
})

  done()
}
