import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { teamList } from '../teams.js'
import { discordRestApi } from './discordRestApi.js'

const teamsSection = (lfm: any[]) => {
  const regionText = (regions: string[]) =>
    regions.length === 3 ? 'any' : regions.join(',')
  const expText = (exps: string[]) =>
    exps.length === 3 ? 'any' : exps.join(',')

  const c1 = 25
  const c2 = 15
  const c3 = 15
  const c4 = 30
  const lfmLines = lfm
    .map(
      (t) =>
        `<${t.team.replace(' ', '-').padEnd(c1 - 1)}${regionText(
          t.timezones
        ).padEnd(c2)}${expText(t.exp).padEnd(c3)}${t.leaders
          .join(',')
          .padEnd(c4 - 1)}>\n`
    )
    .join('')
  const hash = '#'.repeat(c1 + c2 + c3 + c4)
  const eq = '='.repeat(c1 + c2 + c3 + c4)
  const md = '```markdown'
  const mdEnd = '```'
  const headerPad = ''.padEnd(c1 + c2 - 15)
  const postContent = `${md}
$> list teams --where lookingForMembers
${hash}
${' Team name'.padEnd(c1)}${'Timezone(s)'.padEnd(c2)}${'Looking for'.padEnd(
    c3
  )}${'Leaders'.padEnd(c4)}
${eq}
${lfmLines}

$>
${mdEnd}`
  return postContent
}

const usersSection = (lfg: any[]) => {
  const c1 = 25
  const c2 = 15
  const c3 = 15
  const lfmLines = lfg
    .map(
      (u) =>
        `<${u.name.padEnd(c1 - 1)}${u.timezone.padEnd(c2)}${u.exp.padEnd(
          c3 - 1
        )}>\n`
    )
    .join('')
  const hash = '#'.repeat(c1 + c2 + c3)
  const eq = '='.repeat(c1 + c2 + c3)
  const md = '```markdown'
  const mdEnd = '```'
  const headerPad = ''.padEnd(c1 + c2 - 15)
  const postContent = `${md}
$> list people --where lookingForTeam
${hash}
${' User name'.padEnd(c1)}${'Timezone'.padEnd(c2)}${'Experience'.padEnd(c3)}
${eq}
${lfmLines}

$>
${mdEnd}`
  return postContent
}

// This represents higher level actions when interacting with Discord - it relies on the REST api wrapper, but exposes
// operations that may require multiple such REST calls for a single logical operation
class DiscordApi {
  async getUsersFromRole(roleId: string) {
    const serverUsers = await discordRestApi.getGuildMembers()
    const roleUsers = serverUsers.filter((user) => {
      return user.roles.includes(roleId)
    })
    return roleUsers
  }
  async getUserRoles(userId: string) {
    const user = await discordRestApi.getGuildMember(userId)
    return user.roles
  }
  async getUserTeam(userId: string) {
    const roles = await this.getUserRoles(userId)
    const team = teamList.find((t) => roles.includes(t.discordTeamId))
    if (!team) return undefined

    const isLead = roles.includes(hackWeeklyDiscord.specialRoles.teamLead)
    return {
      isLead,
      ...team,
    }
  }
  async addUserToTeam(userId: string, teamId: string) {
    return await discordRestApi.AddRole(teamId, userId)
  }
  async removeUserFromTeam(userId: string, teamId: string) {
    return await discordRestApi.RemoveRole(teamId, userId)
  }
  async removeUserFromTeams(userId: string, teamIds: string[]) {
    const tasks = teamIds.map((teamId) =>
      discordRestApi.RemoveRole(teamId, userId)
    )
    await Promise.all(tasks)
  }
  async messageChannel(channelId: string, message: string) {
    return await discordRestApi.MessageChannel(channelId, message)
  }
  async editMessage(channelId: string, messageId: string, newMessage: string) {
    return await discordRestApi.EditMessage(channelId, messageId, newMessage)
  }

  async updateLFGpost() {
    const lfm = [
      {
        team: 'Lavender snake',
        exp: ['beg', 'int'],
        timezones: ['Asia', 'EU'],
        leaders: ['SuperKebbit'],
      },
      {
        team: 'Crimson eagle',
        exp: ['int'],
        timezones: ['NA'],
        leaders: ['FrolickingMustelid', 'sydney'],
      },
      {
        team: 'Indigo turtle',
        exp: ['adv', 'int'],
        timezones: ['NA', 'EU', 'Asia'],
        leaders: ['Rollie'],
      },
    ]

    const lfg = [
      {
        name: 'Bob',
        exp: 'beg',
        timezone: 'EU',
      },
      {
        name: 'Bob',
        exp: 'int',
        timezone: 'EU',
      },
      {
        name: 'Bob',
        exp: 'adv',
        timezone: 'Asia',
      },
      {
        name: 'Bob',
        exp: 'beg',
        timezone: 'NA',
      },
      {
        name: 'Bob',
        exp: 'beg',
        timezone: 'EU',
      },
      {
        name: 'Bob',
        exp: 'adv',
        timezone: 'EU',
      },
      {
        name: 'Bob',
        exp: 'int',
        timezone: 'Asia',
      },
    ]

    const postContent = `
${teamsSection(lfm)}${usersSection(lfg)}
`
    const teamSearchMessages = await discordRestApi.GetMessages(
      hackWeeklyDiscord.lfgChannel
    )

    teamSearchMessages
      .filter((m) => m.author.id === hackWeeklyDiscord.botId)
      .map((m) =>
        discordRestApi.DeleteMessage(hackWeeklyDiscord.lfgChannel, m.id)
      )

    return await discordRestApi.MessageChannel(
      hackWeeklyDiscord.lfgChannel,
      postContent
    )
  }
}

export const discordApi = new DiscordApi()
