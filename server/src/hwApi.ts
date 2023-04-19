import { discordApi } from './discord/discordApi.js'
import { githubApi } from './github/githubApi.js'
import { TeamT, UserT } from 'shared'
class HWApi {
  invoker: UserT
  constructor(invoker: UserT) {
    this.invoker = invoker
  }
  // TODO: any -> real types
  async addUserToTeam(user: UserT, team: TeamT) {
    // TODO: call appropriate firebase, github, and discord fn's
    // await discordApi.addUserToTeam(user.discordId, team.discordId)
    // githubApi.addUserToTeam(user.githubId, team.githubId)
  }
  async removeUserFromTeam(user: UserT, team: TeamT) {
    // TODO: call appropriate firebase, github, and discord fn's
  }
}

export const hwApi = (user: UserT) => new HWApi(user)
export const resolveUser = (identifier: { discordId?: string }) => {
  if (identifier.discordId) {
    return undefined // TODO
  } else {
    throw new Error('No identifier supplied')
  }
}
