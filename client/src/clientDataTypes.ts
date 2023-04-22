import {
  TeamT as TeamTS,
  UserT as UserTS,
  ProjectT as ProjectTS,
  ImplementationT as ImplementationTS,
  RepoT as RepoTS,
} from "./data-types/dataTypes";

type IdT = {
  id: string;
};
export type TeamT = TeamTS | IdT;
export type UserT = UserTS | IdT;
export type ProjectT = ProjectTS | IdT;
export type ImplementationT = ImplementationTS | IdT;
export type RepoT = RepoTS | IdT;
