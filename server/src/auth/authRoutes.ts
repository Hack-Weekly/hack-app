import { FastifyInstance } from 'fastify'
import { verifyKey } from 'discord-interactions'
import {
  discordRestApi,
  DiscordUserRestApi,
} from '../discord/discordRestApi.js'
import {
  hackWeeklyDiscord,
  rollieId,
  testUserId,
} from '../discord/hackWeeklyDiscord.js'
import { discordAppApi } from '../admin/discordAppApi.js'
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
import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import { firestoreDb } from '../firebase.js'
import { UserT } from 'shared'
import { Octokit } from 'octokit'
import { currentHost } from '../shared.js'

declare module 'fastify' {
  interface FastifyInstance {
    discordAuth: OAuth2Namespace
    githubAuth: OAuth2Namespace
  }
}

// These are the handlers for 'things that happen in discord'. Someone uses our app's commands, or context
// menu action, it makes a request here.
export default function authRoutes(server: FastifyInstance, options, done) {
  // Callback for discord auth
  const stateStorage = {}
  server.get('/discord', async (req, reply) => {
    const { token } =
      await server.discordAuth.getAccessTokenFromAuthorizationCodeFlow(req)
    stateStorage[req.params['state']] = {
      discordToken: token,
    }
    console.log(token)
    reply.redirect('/login/github')
    return
  })
  server.get('/github', async (req, reply) => {
    const discordToken = stateStorage[req.params['state']]?.discordToken
    if (!discordToken) {
      reply.code(200).send('invalid state')
      return
    }
    const { token } =
      await server.githubAuth.getAccessTokenFromAuthorizationCodeFlow(req)
    console.log(token)

    // Load github data for user
    const octokit = new Octokit({ auth: token.access_token })
    const githubUser = (await octokit.rest.users.getAuthenticated()).data
    console.log(githubUser)

    // Load discord data for user
    const discordApi = new DiscordUserRestApi(discordToken.access_token)
    const discordUser = await discordApi.getUserData()
    console.log(discordUser)

    const user: UserT = {
      id: '',
      name: discordUser.username,
      discordId: discordUser.id,
      githubId: githubUser.login,
      experience: 3,
      team: '',
      tech: {},
      lft: null,
      teamLead: false,
    }
    const usersCol = firestoreDb.collection('users')
    await usersCol.add(user)

    // TODO: redirect back to front end with jwt
    reply.code(200).send('ok')
    return
  })

  server.get('/register', async (req, reply) => {
    reply.redirect(`${currentHost}/login/discord`)
  })

  done()
}
