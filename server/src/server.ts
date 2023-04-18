import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import discordInteractionsHandler from './discordInteractions/routes.js'
import fastifyRaw from 'fastify-raw-body'

export function createServer() {
  const server = fastify()

  server.register(fastifyRaw, {
    field: 'rawBody', // change the default request.rawBody property name
    encoding: 'utf8', // set it to false to set rawBody as a Buffer **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    routes: ['/discordInteractions'], // array of routes, **`global`** will be ignored, wildcard routes not supported
  })

  server.register(fastifyCors, {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  })

  server.register(discordInteractionsHandler, {
    prefix: '/discordInteractions',
  })

  server.setErrorHandler((error, req, res) => {
    console.error(error)
    req.log.error(error.toString())
    res.code(400).send({ error })
  })

  return server
}
