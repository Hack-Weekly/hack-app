import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

// secret variables - when you hard code them in, the routes work, but not sure how to fix >:{
const privateKeyString = process.env.GITHUB_PRIVATE_KEY;
const applicationId = process.env.GITHUB_APP_ID;
const instId = process.env.GITHUB_INSTALLATION_ID;
const requiredAuthInfo = {
  appId: applicationId,
  privateKey: privateKeyString,
  installationId: instId
};
// variables used in every route
const orgName = "Hack-Weekly";
const headerObject = { 'X-Github-Api-Version': '2022-11-28' }; // required headers for these routes - minimum requirement

// More info: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-an-organization-repository
async function createRepoForTeam() {

  // INPUT VARIABLES NEEDED FOR ROUTE
  const teamName = "01_testing_create_team";
  const repoName = "01_testing_create_repo";

  // Next 4 lines allow for the app to use the API REST endpoints
  const auth = createAppAuth(requiredAuthInfo);
  const { token } = await auth({ type: "installation" });
  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit({ auth: token });

  /**These next three lines will get the team id from github, can always just be manually inputted */
  const teams = await octokit.rest.teams.list({ org: orgName }); // get all teams
  const team = teams.data.find(t => t.name === teamName); // get team object from teams array
  const teamId = team.id; // get team id from team object

  await octokit.request('POST /orgs/{org}/repos', {
    org: orgName, // required
    name: repoName, // required - name of repository that is being created
    visibility: "public", // either private or public 
    team_id: teamId, // this assigns repo to specific team
    permission: "pull", // default
    headers: headerObject
  });
  console.log(`The repository ${repoName} has been CREATED for ${teamName}`);
};
// createRepoForTeam();

// More Info: https://docs.github.com/en/rest/teams/teams?apiVersion=2022-11-28#create-a-team
async function createTeam() {

  // INPUT VARIABLES NEEDED FOR ROUTE
  const teamName = "01_testing_create_team";

  // Next 4 lines allow for the app to use the API REST endpoints
  const auth = createAppAuth(requiredAuthInfo);
  const { token } = await auth({ type: "installation" });
  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit({ auth: token });

  await octokit.request('POST /orgs/{org}/teams', {
    org: orgName,
    name: teamName,
    privacy: "closed", // visible to all members of this organization - default is secret 
    headers: headerObject // set above globally
  });

  console.log(`Team ${teamName} created!`);
};
// createTeam();

//More info https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#add-or-update-team-membership-for-a-user
async function addUserToTeam() {
  // INPUT VARIABLES NEED FOR ROUTES
  const teamName = "01_testing_create_team";
  const userName = "hack-weekly-test-user";

  const auth = createAppAuth(requiredAuthInfo);
  const { token } = await auth({ type: "installation" });
  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit({ auth: token });

  await octokit.request("PUT /orgs/{org}/teams/{team_slug}/memberships/{username}", {
    org: orgName,
    team_slug: teamName,
    username: userName,
    role: "member", // can be either member or maintainer, but og user should be team/lead and should be maintainer
    headers: headerObject
  });

  console.log(`${userName} has been ADDED to ${teamName}`);
};
// addUserToTeam();

// More info https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#remove-team-membership-for-a-user
async function removeUserFromTeam() {
  // INPUT VARIABLES NEEDED FOR ROUTE
  const teamName = "01_testing_create_team";
  const userName = "hack-weekly-test-user";

  // Next 4 lines allow for the app to use the API REST endpoints
  const auth = createAppAuth(requiredAuthInfo);
  const { token } = await auth({ type: "installation" });
  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit({ auth: token });

  await octokit.request("DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}", {
    org: orgName,
    team_slug: teamName,
    username: userName,
    headers: headerObject
  });
  console.log(`${userName} has been REMOVED from ${teamName}`);
}
// removeUserFromTeam();

// High level functions for interacting with the github API
class GithubApi {
  async createRepoForTeam(repoName: string, teamId: string) {
    // TODO
  }
  async createTeam() {

    // TODO
  }
  async addUserToTeam(userId: string, teamId: string) {
    // TODO
  }
  async removeUserFromTeam(userId: string, teamId: string) {
    // TODO
  }
}

export const githubApi = new GithubApi()