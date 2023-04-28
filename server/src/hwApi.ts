import { discordApi } from './discord/discordApi.js'
import { githubApi } from './github/githubApi.js'
import { TeamT, UserT } from 'shared'
import { firebaseApi } from './firebase/firebaseApi.js'
import { hackWeeklyDiscord } from './discord/hackWeeklyDiscord.js'
export class HWApi {
  invoker: UserT
  constructor(invoker: UserT) {
    this.invoker = invoker
  }

  // Permissions helpers
  private self(user: UserT) {
    return this.invoker.id === user.id
  }
  private admin() {
    return this.invoker.admin
  }
  private teamLead(teamId: string) {
    return this.invoker.teamLead && this.invoker.team === teamId
  }
  private selfOrAdmin(user: UserT) {
    return this.self(user) || this.admin()
  }
  private selfOrAdminOrTeamLead(user: UserT, teamId: string) {
    return this.self(user) || this.admin() || this.teamLead(teamId)
  }
  async register(
    discordId: string,
    githubId: string,
    discordName: string,
    discordRolesIds: string[]
  ) {
    const existingUser = await firebaseApi.getUser({ discordId, githubId })
    if (existingUser) {
      return { error: 'User already exists' }
    }
    // Derive team from discord
    const teams = await firebaseApi.getTeams()
    const curTeam = teams.find((t) => discordRolesIds.includes(t.discordRole))
    const teamLead = discordRolesIds.includes(
      hackWeeklyDiscord.specialRoles.teamLead
    )

    let experience = 2
    if (discordRolesIds.includes(hackWeeklyDiscord.specialRoles.beginner)) {
      experience = 1
    } else if (
      discordRolesIds.includes(hackWeeklyDiscord.specialRoles.advanced)
    ) {
      experience = 3
    }

    let timezone: any = 'NA'
    if (discordRolesIds.includes(hackWeeklyDiscord.specialRoles.eu)) {
      timezone = 'EU'
    } else if (discordRolesIds.includes(hackWeeklyDiscord.specialRoles.asia)) {
      timezone = 'Asia'
    }
    const newUser: UserT = {
      id: '',
      discordId,
      experience,
      githubId,
      name: discordName,
      tech: {},
      team: curTeam?.id ?? null,
      teamLead,
      lft: null,
      timezone,
      admin: discordRolesIds.includes(hackWeeklyDiscord.specialRoles.admin),
    }

    const addToTeam = async () => {
      // Since user is registering, make sure they are assigned the appropriate github team
      if (curTeam) {
        await githubApi.addUserToTeam(newUser.githubId, curTeam.githubTeam)
      }
    }

    await Promise.all([firebaseApi.addUser(newUser), addToTeam()])

    return { message: 'Registration complete' }
  }
  async addUserToTeam(user: UserT, team: TeamT, silent = false) {
    if (!this.admin() && !this.teamLead(team.id)) {
      return { error: `You don't have rights to perform this operation` }
    }
    if (user.team === team.id) {
      return { error: `User is already on that team` }
    }
    if (!this.admin() && user.team) {
      return { error: `User already on a team; ask them to '/leaveteam' first` }
    }

    if (user.team) {
      await this.removeUserFromTeam(user)
      user.team = null
    }

    // Firebase
    user.team = team.id
    const refreshLfg = !!user.lft
    user.lft = null
    await firebaseApi.updateUser(user)

    // Github
    await githubApi.addUserToTeam(user.githubId, team.githubTeam)

    // Discord
    await discordApi.addUserToTeam(user.discordId, team.discordRole)
    if (refreshLfg) {
      discordApi.updateLFGpost()
    }
    if (!silent) {
      const message = `Hi ${team.name} - you guys have a new member! Everyone please welcome <@${user.discordId}> :)`
      discordApi.messageChannel(team.defaultDiscordChannel, message)
    }

    return { message: `Successfully added ${user.name} to ${team.name}` }
  }
  async removeUserFromTeam(user: UserT) {
    if (!this.selfOrAdmin(user)) {
      // Team leads can do this too, but not to other team leads
      if (!this.teamLead(user.team) || user.teamLead) {
        return { error: `You don't have rights to perform this operation` }
      }
    }

    if (!user.team) {
      return { error: `User '${user.name} is not on a team` }
    }

    const team = await firebaseApi.getTeam(user.team)
    // Discord
    await discordApi.removeUserFromTeams(user.discordId, [
      team.discordRole,
      // If they are leaving their team, they don't keep team lead role
      hackWeeklyDiscord.specialRoles.teamLead,
    ])

    // Github
    await githubApi.removeUserFromTeam(user.githubId, team.githubTeam)

    // Firebase
    user.team = null
    await firebaseApi.updateUser(user)

    return { message: `Successfully removed ${user.name} from ${team.name}` }
  }
  async setLFM(
    team: TeamT,
    blurb: string,
    experience: number[],
    timezone: string[]
  ) {
    if (!this.admin() && !this.teamLead(team.id)) {
      return { error: `You don't have rights to perform this operation` }
    }
    team.lfm = {
      blurb,
      experience: experience,
      timezones: timezone,
    }
    await firebaseApi.updateTeam(team)
    discordApi.updateLFGpost() // not awaiting - want to return quickly

    return { message: 'Updated team LFM status' }
  }
}
