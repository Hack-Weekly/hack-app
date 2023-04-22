import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";

export type LanguageT = "c++" | "c#";

export type CloudProviderT = "GCP" | "AWS" | "Azure";

export type TechT = LanguageT | CloudProviderT;

export type TeamIdT = string;
export type UserIdT = string;
export type ProjectIdT = string;
export type ImplementationIdT = string;
export type RepoIdT = string;

export interface UserT {
  name: string;
  githubId: string;
  discordId: string;
  experience: number; // 1-5
  tech: { [key: string]: number };
  team: TeamIdT;
}
export interface TeamT {
  name: string;
  icon: string;
  repos: Array<RepoIdT>;
  members: Array<UserIdT>;
  discordRole: string;
  githubTeam: string;
  defaultDiscordChannel: string;
  lfm: null | { blurb: string };
}
export interface ProjectT {
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  implementations: Array<ImplementationIdT>;
}
export interface ParticipantContributionT {
  codeContributions: number;
  chatContributions: number;
}
export interface ImplementationT {
  teamId: TeamIdT;
  projectId: ProjectIdT;
  repoId: RepoIdT;
  demo: string;
  participantContribution: Array<ParticipantContributionT>;
}
export interface RepoT {
  path: string;
}
