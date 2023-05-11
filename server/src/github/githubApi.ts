import { App } from 'octokit'
import { Octokit } from '@octokit/core'
import { createAppAuth } from '@octokit/auth-app'
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods'
import { GITHUB_PRIVATE_KEY } from '../secrets.js'
import { RequestParameters } from '@octokit/types'
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types.js'

const orgName = 'Hack-Weekly'

// High level functions for interacting with the github API
class GithubApi {
  octo: Octokit & Api
  private async getOcto() {
    if (!this.octo) {
      // console.log(GITHUB_PRIVATE_KEY)
      // const auth = createAppAuth({
      //   appId: 319149,
      //   privateKey: GITHUB_PRIVATE_KEY,
      //   installationId: 36524583,
      // })
      // const { token } = await auth({ type: 'app' })
      // const MyOctokit = Octokit.plugin(restEndpointMethods)
      // this.octo = new MyOctokit({ auth: token, request: {} })
      const app = new App({
        appId: 319149,
        privateKey: GITHUB_PRIVATE_KEY,
      })
      this.octo = await app.getInstallationOctokit(36524583)
    }
    return this.octo
  }
  private async request(path: string, params: RequestParameters = {}) {
    const octokit = await this.getOcto()
    try {
      return await octokit.request(path, {
        headers: { 'X-Github-Api-Version': '2022-11-28' },
        ...params,
      })
    } catch (e) {
      console.log(`Github request failed: ${e}`)
      return undefined
    }
  }
  private async getTeamId(teamName: string) {
    const octokit = await this.getOcto()
    const teams = await octokit.rest.teams.list({ org: orgName }) // get all teams
    const team = teams.data.find((t) => t.name === teamName) // get team object from teams array
    return team.id
  }

  async createRepoForTeam(repoName: string, teamName: string) {
    const teamId = await this.getTeamId(teamName)
    return await this.request(`POST /orgs/${orgName}/repos`, {
      name: repoName, // required - name of repository that is being created
      visibility: 'public', // either private or public
      team_id: teamId, // this assigns repo to specific team
      permission: 'pull', // default
    })
  }
  deleteRepo(repoName: string) {
    return this.request(`DELETE /repos/${orgName}/${repoName}`)
  }
  createTeam(teamName: string) {
    return this.request(`POST /orgs/${orgName}/teams`, {
      name: teamName,
      privacy: 'closed', // visible to all members of this organization - default is secret
    })
  }
  deleteTeam(teamName: string) {
    return this.request(`DELETE /orgs/${orgName}/teams/${teamName}`)
  }
  addUserToTeam(userId: string, teamId: string) {
    return this.request(
      `PUT /orgs/${orgName}/teams/${teamId}/memberships/${userId}`,
      {
        role: 'member', // can be either member or maintainer, but og user should be team/lead and should be maintainer
      }
    )
  }
  removeUserFromTeam(userId: string, teamId: string) {
    return this.request(
      `DELETE /orgs/${orgName}/teams/${teamId}/memberships/${userId}`
    )
  }
}

export const githubApi = new GithubApi()
