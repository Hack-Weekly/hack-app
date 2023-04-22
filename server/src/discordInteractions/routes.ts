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
  server.get('/discord/updateLFGpost', async (req, reply) => {
    const resp = await discordApi.updateLFGpost()
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
    testCol.add({ user: 'tester' })
    const ret = []
    for (const docRef of d2) {
      const doc = await docRef.get()
      const data = doc.data()
      console.log(data)
      ret.push(data)
    }
    reply.code(200).send(ret)
  })
  // create firebase teams from static data
  server.get('/firebase/createTeams', async (req, reply) => {
    const currentTeams = await firebaseApi.getTeams()
    const teamsToAdd = teamList.filter(
      (t) => !currentTeams.find((fst) => fst.name === t.name)
    )
    console.log(teamsToAdd)

    for (const localTeam of teamsToAdd) {
      const team: TeamT = {
        id: '',
        name: localTeam.name,
        discordRole: localTeam.discordTeamId,
        icon: '',
        repos: [],
        githubTeam: localTeam.githubTeamId,
        defaultDiscordChannel: localTeam.defaultChannel,
        lfm: null,
      }
      await firebaseApi.addTeam(team)
    }
    reply.code(200).send('ok')
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
    const member = body.member
    const invoker = member.user.id
    const invokerRoles = member.roles
    const options = (body.data as any).options
    if (body.type === InteractionType.ApplicationCommand) {
      if (body.data.name === 'foo') {
        interactionReply('bar', res)
        return
      }
      if (body.data.name === 'lfm') {
        const blurb = options.find((o) => o.name === 'blurb')?.value
        const experiences = options
          .find((o) => o.name === 'experience')
          ?.value?.toLowerCase()
          ?.split(',')
          ?.map((ex) =>
            ex === 'beg' ? 1 : ex === 'int' ? 2 : ex === 'adv' ? 3 : -1
          ) as number[]
        const timezones = options
          .find((o) => o.name === 'timezone')
          ?.value?.toLowerCase()
          ?.split(',')
          ?.map((tz) =>
            tz === 'na'
              ? 'na'
              : tz === 'eu'
              ? 'EU'
              : tz === 'asia'
              ? 'Asia'
              : 'Unknown'
          )

        // Check input params
        if (!blurb) {
          return interactionReply(
            "Provide a short (<60 char)  description of your skillset or what type of team you're looking for",
            res
          )
        }
        if (!experiences?.length || experiences.find((ex) => ex === -1)) {
          return interactionReply('Invalid experience level supplied', res)
        }
        if (
          !timezones?.length ||
          timezones.find((ex) => ex !== 'NA' && ex !== 'EU' && ex !== 'Asia')
        ) {
          return interactionReply('Invalid timezones supplied', res)
        }
        // Input params all check out

        // Make sure this user is actually registered
        const users = await firebaseApi.getUsers()

        const user = users.find((u) => u.discordId === invoker)
        if (!user) {
          return interactionReply(
            "You aren't in our database - please run '/register' first",
            res
          )
        }
        if (!user.teamLead) {
          return interactionReply('Only team leads can mark team as lfm', res)
        }
        const teams = await firebaseApi.getTeams()

        const team = teams.find((t) => t.id === user.team)

        team.lfm = {
          blurb,
          experience: experiences,
          timezones,
        }
        await firebaseApi.updateTeam(team)
        interactionReply("Set team as 'Looking for members'", res)
        await discordApi.updateLFGpost()
      }
      if (body.data.name === 'lft') {
        const blurb = options.find((o) => o.name === 'blurb')?.value

        if (!blurb) {
          return interactionReply(
            "Provide a short (<60 char)  description of your skillset or what type of team you're looking for",
            res
          )
        }

        // Make sure this user is actually registered
        const users = await firebaseApi.getUsers()

        const user = users.find((u) => u.discordId === invoker)
        if (!user) {
          return interactionReply(
            "You aren't in our database - please run '/register' first",
            res
          )
        }

        user.lft = { blurb }
        await firebaseApi.updateUser(user)
        interactionReply("Set user as 'Looking for team'", res)
        await discordApi.updateLFGpost()
      }
      // Register new user
      if (body.data.name === 'register') {
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
          team: curTeam.id,
          teamLead,
          lft: null,
          timezone,
        }

        await firebaseApi.addUser(newUser)

        interactionReply(`User created!`, res)
        return
      }

      // Handle /leaveteam Command
      if (body.data.name === 'leaveteam') {
        const team = teamList.find((t) =>
          invokerRoles.includes(t.discordTeamId)
        ) // We'll just assume they aren't on multiple
        if (!team) {
          interactionReply("You aren't on a team", res)
        } else {
          await discordApi.removeUserFromTeams(invoker, [
            team.discordTeamId,
            // If they are leaving their team, they don't keep team lead role
            hackWeeklyDiscord.specialRoles.teamLead,
          ])
          interactionReply(`Removed from ${team.name}`, res)
        }
      } else if (body.data.name === 'Recruit') {
        const data = (body as APIUserApplicationCommandInteraction).data
        if (!invokerRoles.includes(hackWeeklyDiscord.specialRoles.teamLead)) {
          interactionReply("You aren't a team lead", res)
          return
        }
        const invokerTeam = teamList.find((t) =>
          invokerRoles.includes(t.discordTeamId)
        )
        if (!invokerTeam) {
          // We should never be in this case where someone is a team lead but not on a team, but we'll
          // check anyway
          interactionReply("You aren't on a team", res)
          return
        }
        const userRoles = await discordApi.getUserRoles(data.target_id)
        const userTeam = teamList.find((t) =>
          userRoles.includes(t.discordTeamId)
        )
        if (userTeam) {
          interactionReply(
            'User is already on a team - ask them to /leaveteam first',
            res
          )
          return
        }

        // Checks all done - add the user
        await discordApi.addUserToTeam(
          data.target_id,
          invokerTeam.discordTeamId
        )
        interactionReply('User recruited!', res)
      }
    } else if (body.type === InteractionType.MessageComponent) {
      // Handle interaction triggered by message components
    }
    console.log('404')
    res.status(404).send('unknown command')
  })

  done()
}
