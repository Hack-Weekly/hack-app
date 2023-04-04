import { FastifyInstance } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { generateId } from '../utils/generateId.js'
import { isValidEmail, isValidPassword } from '../utils/validators.js'
import { InteractionType, verifyKey } from 'discord-interactions'
export default function discordInteractionsHandler(
  server: FastifyInstance,
  options,
  done
) {
  server.get('', async (req, reply) => {
    reply.code(200).send('get')
  })
  server.post('', async (req, res) => {
    const body = req.body as any
    const sig = req.headers['X-Signature-Ed25519'] as string
    const ts = req.headers['X-Signature-Timestamp'] as string
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
        type: 4,
        data: { content: 'bar' },
      })
      return
    }

    console.log('404')
    res.status(404).send('unknown command')
  })

  done()
}
