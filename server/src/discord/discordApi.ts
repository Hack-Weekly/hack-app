import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { teamList } from '../teams.js'
import {discordRestApi} from './discordRestApi.js'

// This represents higher level actions when interacting with Discord - it relies on the REST api wrapper, but exposes
// operations that may require multiple such REST calls for a single logical operation
class DiscordApi {
  async getUsersFromRole(roleId: string) {
    const serverUsers = await discordRestApi.getGuildMembers();
    const roleUsers = serverUsers.filter((user) => {return(user.roles.includes(roleId))})
    return(roleUsers)
  }
  async getUserRoles(userId: string) {
    const user = await discordRestApi.getGuildMember(userId);
    return(user.roles)
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
}

export const discordApi = new DiscordApi()
