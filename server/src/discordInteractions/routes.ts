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
    const body = req.body
    const sig = req.headers['X-Signature-Ed25519'] as string
    const ts = req.headers['X-Signature-Timestamp'] as string
    const appPublicKey =
      '5cb905f19d79c1c76e6fe34046923e514cb0a79277c5c32868b71c3bcd0e4646'
    console.log(sig)
    console.log(ts)
    console.log(req.rawBody)

    const isValidRequest = verifyKey(req.rawBody, sig, ts, appPublicKey)
  })

  done()
}
