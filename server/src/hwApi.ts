import { discordApi } from './discord/discordApi.js'
import { githubApi } from './github/githubApi.js'

class HWApi {
  // TODO: any -> real types
  async addUserToTeam(user: any, team: any) {
    // TODO: call appropriate firebase, github, and discord fn's
    // await discordApi.addUserToTeam(user.discordId, team.discordId) ==> READY
    // githubApi.addUserToTeam(user.githubId, team.githubId)
  }
  async removeUserFromTeam(user: any, team: any) {
    // TODO: call appropriate firebase, github, and discord fn's
    // await discordApi.removeUserFromTeam(user.discordId, team.discordId) ==> READY
  }
}

export const hwApi = new HWApi()
