import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { teamList } from '../teams.js'
import { discordRestApi } from './discordRestApi.js'
import { firebaseApi } from '../firebase/firebaseApi.js'
import { UserT } from 'shared'

const teamsSection = async () => {
  const teams = (await firebaseApi.getTeams()).filter((t) => t.lfm)
  const leaders = (await firebaseApi.getUsers()).filter((u) => u.teamLead)
  const regionText = (regions: string[]) =>
    regions.length === 3 ? 'any' : regions.join(',')
  const expText = (exps: number[]) =>
    exps.length === 3
      ? 'any'
      : exps
          .map((ex) => (ex === 1 ? 'beg' : ex === 2 ? 'int' : 'adv'))
          .join(',')

  const c1 = 20
  const c2 = 13
  const c3 = 13
  const c4 = 25
  const lfmLines = teams.length
    ? teams
        .map(
          (t) =>
            `<${t.name.replace(' ', '-').padEnd(c1 - 1)}${regionText(
              t.lfm.timezones
            ).padEnd(c2)}${expText(t.lfm.experience).padEnd(c3)}${leaders
              .filter((l) => l.team === t.id)
              .map((l) => l.name)
              .join(',')
              .padEnd(c4 - 1)}>\n  ${t.lfm.blurb}\n`
        )
        .join('')
    : '  (no teams currently looking for members)'

  console.log(teams)
  console.log(lfmLines)
  const hash = '#'.repeat(c1 + c2 + c3 + c4)
  const eq = '='.repeat(c1 + c2 + c3 + c4)
  const md = '```markdown'
  const mdEnd = '```'
  const headerPad = ''.padEnd(c1 + c2 - 15)
  const postContent = `${md}
$> list teams --where lookingForMembers
${hash}
${' Team name'.padEnd(c1)}${'Timezones'.padEnd(c2)}${'Looking for'.padEnd(
    c3
  )}${'Leaders'.padEnd(c4)}
${eq}
${lfmLines}

$>
${mdEnd}`
  return postContent
}

const usersSection = async () => {
  const users = (await firebaseApi.getUsers()).filter((u) => u.lft)

  const c1 = 20
  const c2 = 13
  const c3 = 13
  const exp = (user: UserT) =>
    user.experience === 1 ? 'beg' : user.experience === 2 ? 'int' : 'adv'
  const lfmLines = users.length
    ? users
        .map(
          (u) =>
            `<${u.name.padEnd(c1 - 1)}${u.timezone.padEnd(c2)}${exp(u).padEnd(
              c3 - 1
            )}>\n  ${u.lft.blurb}\n`
        )
        .join('')
    : '  (no users currently looking for teams)'
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
  async addUserToMember(userId: string) {
    return await discordRestApi.AddRole(
      hackWeeklyDiscord.specialRoles.member,
      userId
    )
  }
  async removeUserFromTeam(userId: string, teamId: string) {
    return await discordRestApi.RemoveRole(teamId, userId)
  }
  async removeUserFromTeams(userId: string, teamIds: string[]) {
    // Discord doesn't like this
    // const tasks = teamIds.map((teamId) => {
    //   try {
    //     discordRestApi.RemoveRole(teamId, userId)
    //   } catch (e) {
    //     console.log(`Failed to remove from ${teamId}`)
    //   }
    // })
    // await Promise.all(tasks)
    for (const teamId of teamIds) {
      await discordRestApi.RemoveRole(teamId, userId)
    }
  }
  async messageChannel(channelId: string, message: string) {
    return await discordRestApi.MessageChannel(channelId, message)
  }
  async editMessage(channelId: string, messageId: string, newMessage: string) {
    return await discordRestApi.EditMessage(channelId, messageId, newMessage)
  }

  private async _updateLFGpost() {
    const postContent = `
${await teamsSection()}${await usersSection()}
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

  async updateLFGpost() {
    try {
      return await this._updateLFGpost()
    } catch (e) {
      console.log(`Failed to update LFG post: ${e}`)
    }
  }
}

export const discordApi = new DiscordApi()
