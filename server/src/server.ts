import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import discordInteractionsHandler from './discordInteractions/routes.js'
import fastifyRaw from 'fastify-raw-body'
import authRoutes from './auth/authRoutes.js'
import oauthPlugin from '@fastify/oauth2'
import {
  DISCORD_APP_PRIVATE_KEY,
  GITHUB_CLIENT_SECRET,
  GITHUB_PRIVATE_KEY,
} from './secrets.js'
import { currentHost } from './shared.js'
import { hackWeeklyDiscord } from './discord/hackWeeklyDiscord.js'
import testingHandler from './testing/testingRoutes.js'
import proj4Routes from './proj4/proj4Routes.js'

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

  server.register(oauthPlugin, {
    name: 'discordAuth',
    scope: ['identify'],
    credentials: {
      client: {
        id: hackWeeklyDiscord.botId,
        secret: DISCORD_APP_PRIVATE_KEY,
      },
      auth: oauthPlugin.fastifyOauth2.DISCORD_CONFIGURATION,
    },
    startRedirectPath: '/login/discord',
    callbackUri: `${currentHost}/auth/discord`,
  })
  server.register(oauthPlugin, {
    name: 'githubAuth',
    credentials: {
      client: {
        id: 'Iv1.cb28d61adce5c706',
        secret: GITHUB_CLIENT_SECRET,
      },
      auth: oauthPlugin.fastifyOauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/login/github',
    callbackUri: `${currentHost}/auth/github`,
  })

  server.register(authRoutes, {
    prefix: '/auth',
  })
  server.register(discordInteractionsHandler, {
    prefix: '/discordInteractions',
  })
  server.register(testingHandler, {
    prefix: '/testing',
  })
  server.register(proj4Routes, {
    prefix: '/proj4',
  })

  server.setErrorHandler((error, req, res) => {
    console.error(error)
    req.log.error(error.toString())
    res.code(400).send({ error })
  })

  return server
}
