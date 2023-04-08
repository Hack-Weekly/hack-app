import { discordApi } from './discordApi.js'
import { githubApi } from './github/githubApi.js'

class HWApi {
  // TODO: any -> real types
  async addUserToTeam(user: any, team: any) {
    // TODO: call appropriate github and discord fn's
    // await discordApi.addUserToTeam(user.discordId, team.discordId)
    // githubApi.addUserToTeam(user.githubId, team.githubId)
  }
  async removeUserFromTeam(user: any, team: any) {
    // TODO: call appropriate github and discord fn's
  }
}

export const hwApi = new HWApi()
