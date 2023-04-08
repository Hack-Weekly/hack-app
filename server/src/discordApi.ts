import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { teamList } from './teams.js'

class DiscordApi {
  async getUsersFromRole(roleId: string) {
    return ['todo']
  }
  async getUserRoles(userId: string) {
    return ['todo']
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
    // TODO
  }
  async removeUserFromTeam(userId: string, teamId: string) {
    // TODO
  }
}

export const discordApi = new DiscordApi()
