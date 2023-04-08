import { FastifyInstance } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { generateId } from '../utils/generateId.js'
import { isValidEmail, isValidPassword } from '../utils/validators.js'
import { InteractionType, verifyKey } from 'discord-interactions'
import { discordRestApi } from '../discordRestApi.js'
import { hackWeeklyDiscord, rollieId } from '../hackWeeklyDiscord.js'
import { discordAppApi } from '../admin/discordAppApi.js'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseApp = initializeApp()
const db = getFirestore(firebaseApp)

export default function discordInteractionsHandler(
  server: FastifyInstance,
  options,
  done
) {
  server.get('', async (req, reply) => {
    const resp = await discordRestApi.AddRole(
      hackWeeklyDiscord.specialRoles.mentor,
      rollieId
    )
    reply.code(200).send(resp)
  })
  server.get('/register', async (req, reply) => {
    const res = await discordAppApi.AddAllCommands()
    reply.code(200).send(res)
  })
  server.get('/firebase', async (req, reply) => {
    const testCol = db.collection('test')
    const d1 = await testCol.get()
    console.log(d1)
    const d2 = await testCol.listDocuments()
    for (const docRef of d2) {
      const doc = await docRef.get()
      console.log(doc)
    }
    const docs = await db.getAll()
    console.log(docs)
    reply.code(200).send(docs)
  })
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

    console.log('Check body 1')

    // Replying to ping (requirement 2.)
    if (body.type == InteractionType.PING) {
      console.log('Body1')
      res.status(200).send({ type: InteractionType.PING })
      return
    }

    console.log('Check foo')
    // Handle /foo Command
    if (body.data.name == 'foo') {
      console.log('Body')
      console.log(body)
      console.log('Body data')
      console.log(body.data)
      res.status(200).send({
        type: InteractionType.MESSAGE_COMPONENT,
        data: { content: 'bar' },
      })
      return
    }

    console.log('404')
    res.status(404).send('unknown command')
  })

  done()
}
