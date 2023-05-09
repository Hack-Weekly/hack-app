import { discordApi } from './discord/discordApi.js'
import { githubApi } from './github/githubApi.js'
import { TeamT, UserT } from 'shared'
import { firebaseApi } from './firebase/firebaseApi.js'
import { hackWeeklyDiscord } from './discord/hackWeeklyDiscord.js'
import { DateTime } from 'luxon'
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
  static async register(
    discordId: string,
    githubId: string,
    discordName: string,
    discordRolesIds: string[]
  ) {
    const existingUser = await firebaseApi.getUser({
      discordId,
      ...(githubId ? { githubId } : {}),
    })
    if (existingUser) {
      if (githubId && !existingUser.githubId) {
        // TODO: I don't love that people just specify an ID with no validation
        existingUser.githubId = githubId
        await firebaseApi.updateUser(existingUser)
        if (existingUser.team) {
          const curTeam = await firebaseApi.getTeam(existingUser.team)
          await githubApi.addUserToTeam(githubId, curTeam.githubTeam)
        }

        return { message: 'Updated existing github ID' }
      }

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

    const addToGithubTeam = async () => {
      // Since user is registering, make sure they are assigned the appropriate github team
      if (curTeam) {
        await githubApi.addUserToTeam(newUser.githubId, curTeam.githubTeam)
      }
    }

    const addMemberDiscordRole = async () => {
      if (!discordRolesIds.includes(hackWeeklyDiscord.specialRoles.member)) {
        await discordApi.addUserToMember(newUser.discordId)
      }
    }

    await Promise.all([
      firebaseApi.addUser(newUser),
      addToGithubTeam(),
      addMemberDiscordRole(),
    ])

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
    user.continueStatus = null
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
  async prePurge() {
    if (!this.admin()) {
      return { error: `You don't have rights to perform this operation` }
    }

    const profile = async <T>(desc: string, promise: Promise<T>) => {
      console.log(`Running: ${desc}`)
      const tStart = DateTime.now()
      const ret = await promise
      const dur = tStart.diffNow()
      console.log(`Done: ${desc} (${dur.toString()})`)
      return ret
    }

    const users = await profile('Getting users', firebaseApi.getUsers())
    const tasks = users
      .filter((u) => u.team)
      //.filter((u) => u.discordId === hackWeeklyDiscord.testUserId)
      .map((u) => {
        u.continueStatus = 'pending'
        return firebaseApi.updateUser(u)
      })
    await profile('Updating users', Promise.all(tasks))
    const activeTeams = await profile(
      'Getting active teams',
      firebaseApi.getActiveTeams()
    )
    const message = (
      team: TeamT
    ) => `Congrats on the previous project completion, <@&${team.discordRole}>! As we prepare for the next project, 
we want to make sure teams have a good idea of how many people are able to contribute. 
If you want to continue on with your current team, please run \`/continue <your-github-id>\`,
substituting the above with your actual github id.\n
If you are not able to participate for the next project, you don't need to do anything, though you will be 
removed from your team and need to be re-added if you wish to participate in future projects.
    `
    const messageTasks = activeTeams.map((t) =>
      discordApi.messageChannel(t.defaultDiscordChannel, message(t))
    )
    await Promise.all(messageTasks)

    // const testTeam = (await firebaseApi.getTeams()).find(
    //   (t) => t.name === 'Vermillion Llama'
    // )
    // discordApi.messageChannel(testTeam.defaultDiscordChannel, message(testTeam))
    return {
      message:
        'Pre-purge completed, message sent to: ' +
        activeTeams.map((t) => t.name).join(','),
    }
  }
  async purge() {
    if (!this.admin()) {
      return { error: `You don't have rights to perform this operation` }
    }
    const users = await firebaseApi.getUsers()
    const usersToRemove = users.filter(
      (u) => u.team && u.continueStatus === 'pending'
    )
    // const tasks = usersToRemove.map((u) => this.removeUserFromTeam(u))
    // await Promise.all(tasks)

    return { message: `Removed ${usersToRemove.length} users from teams` }
  }
}
