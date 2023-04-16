import { Octokit } from "@octokit/rest";
// const Octokit = require("octokit");

const octokit = new Octokit({
  auth: process.env.GITHUB_APP_SECRET,
});

const orgName = "Hack-Weekly";
octokit.repos
  .listForOrg({
    org: orgName,
  })
  .then(({ data }) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });


/**

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_APP_SECRET,
});

const orgName = "your-org-name";
const teamName = "new-team-name";

const teamResponse = await octokit.teams.create({
  org: orgName,
  name: teamName,
  privacy: "closed", // Use "closed" for a private team or "secret" for a hidden team
});

console.log(`Team created! Team ID: ${teamResponse.data.id}`);

 */



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
