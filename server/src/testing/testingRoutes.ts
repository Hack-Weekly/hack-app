import { commands } from '@/admin/discordApp.js'
import { discordApi } from '@/discord/discordApi.js'
import { discordRestApi } from '@/discord/discordRestApi.js'
import { rollieId, hackWeeklyDiscord } from '@/discord/hackWeeklyDiscord.js'
import { firestoreDb } from '@/firebase.js'
import { firebaseApi } from '@/firebase/firebaseApi.js'
import { githubApi } from '@/github/githubApi.js'
import { HWApi } from '@/hwApi.js'
import { teamList } from '@/teams.js'
import { FastifyInstance } from 'fastify'
import { TeamT } from 'shared'

export default function testingHandler(server: FastifyInstance, options, done) {
  // Test route
  server.get('', async (req, res) => {
    console.log(commands)
    res.code(200).send(commands.map((c) => c.command))
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
  server.get('/discord/removeRoles', async (req, res) => {
    await discordApi.removeUserFromTeams(rollieId, [
      '1082092224327725136',
      // If they are leaving their team, they don't keep team lead role
      hackWeeklyDiscord.specialRoles.teamLead,
    ])
    return 'ok'
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
  // create firebase users from discord's data
  server.get('/genAllUsers', async (req, reply) => {
    console.log('Getting firebase users')
    const users = await firebaseApi.getUsers()
    const teams = await firebaseApi.getTeams()
    console.log('Getting discord users')
    const discordUsers = await discordRestApi.getGuildMembers()
    const newDiscordUsers = discordUsers.filter(
      (discordUser) => !users.some((u) => u.discordId === discordUser.user.id)
    )

    let res = '{ users: ['
    for (const discordUser of newDiscordUsers) {
      res += `"${discordUser.user.id}, ${discordUser.user.username}, ${discordUser.roles}",`
      await HWApi.register(
        discordUser.user.id,
        null as any,
        discordUser.user.username,
        discordUser.roles
      )
    }
    res += ']}'
    console.log(res)
    reply.code(200).send(res)
  })
  done()
}
