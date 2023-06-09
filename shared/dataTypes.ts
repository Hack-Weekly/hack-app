import { Timestamp } from "firebase/firestore";

export type LanguageT = "c++" | "c#";

export type CloudProviderT = "GCP" | "AWS" | "Azure";

export type TechT = LanguageT | CloudProviderT;

export type TeamIdT = string;
export type UserIdT = string;
export type ProjectIdT = string;
export type ImplementationIdT = string;
export type RepoIdT = string;

export interface UserT {
  id: string;
  name: string;
  githubId: string;
  discordId: string;
  experience: number; // 1-5
  tech: { [key: string]: number };
  team: TeamIdT;
  teamLead: boolean;
  timezone: "NA" | "EU" | "Asia";
  lft: null | { blurb: string };
  admin: boolean;
  continueStatus?: "pending" | "confirmed";
}
export interface TeamT {
  id: string;
  name: string;
  icon: string;
  repos: Array<RepoIdT>;
  discordRole: string;
  githubTeam: string;
  defaultDiscordChannel: string;
  lfm: null | { blurb: string; timezones: string[]; experience: number[] };
}
export interface ProjectT {
  id: ProjectIdT;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  implementations: Array<ImplementationIdT>;
}
export interface ParticipantContributionT {
  userId: UserIdT;
  codeContributions: number;
  chatContributions: number;
}
export interface ImplementationT {
  id: ImplementationIdT;
  teamId: TeamIdT;
  projectId: ProjectIdT;
  repoId: RepoIdT;
  demo: string;
  participantContribution: Array<ParticipantContributionT>;
}
export interface RepoT {
  id: RepoIdT;
  path: string;
}
