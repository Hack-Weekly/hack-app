import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import {
  ImplementationT,
  ProjectT,
  RepoT,
  TeamT,
  UserT,
} from "../data-types/dataTypes";

export const dummyUsers: UserT[] = [
  {
    id: "u_bran",
    discordId: "disc_bran",
    experience: 2,
    githubId: "git_bran",
    name: "bran",
    team: "stark",
    tech: {
      "c++": 1,
    },
  },
  {
    id: "u_ned",
    discordId: "disc_ned",
    experience: 2,
    githubId: "git_ned",
    name: "ned",
    team: "stark",
    tech: {
      "c#": 2,
    },
  },
];

export const dummyTeams: TeamT[] = [
  {
    id: "t_stark",
    name: "Stark",
    discordRole: "Stark Team",
    icon: "",
    repos: [],
  },
];

function fireDt(dt: DateTime) {
  return Timestamp.fromDate(dt.toJSDate());
}
export const dummyProjects: ProjectT[] = [
  {
    id: "proj_chat",
    description: "Build a chat app",
    startDate: fireDt(DateTime.now().minus({ days: 7 })),
    endDate: fireDt(DateTime.now().plus({ days: 7 })),
    implementations: ["impl_starkchat"],
  },
];

export const dummyImplementations: ImplementationT[] = [
  {
    id: "impl_starkchat",
    demo: "",
    projectId: "proj_chat",
    repoId: "repo_stark",
    teamId: "t_stark",
    participantContribution: [],
  },
];

export const dummyRepos: RepoT[] = [
  {
    id: "repo_stark",
    path: "http://pathtorepo",
  },
];
