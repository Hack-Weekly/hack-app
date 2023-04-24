import {
  addDoc as firebaseAddDoc,
  CollectionReference,
} from "firebase/firestore";
import { ImplementationT, ProjectT, RepoT, TeamT, UserT } from "shared";
import {
  implementationsCol,
  projectsCol,
  reposCol,
  teamsCol,
  usersCol,
} from "./firebaseSetup";

const addDoc = async (col: CollectionReference, doc: any) => {
  const d = { ...doc };
  delete d.id;
  await firebaseAddDoc(col, d);
};

export const createTeam = async (team: TeamT) => {
  return await addDoc(teamsCol, team);
};

export const createUser = async (user: UserT) => {
  return await addDoc(usersCol, user);
};

export const createRepo = async (repo: RepoT) => {
  return await addDoc(reposCol, repo);
};

export const createProject = async (project: ProjectT) => {
  return await addDoc(projectsCol, project);
};

export const createImplementation = async (impl: ImplementationT) => {
  return await addDoc(implementationsCol, impl);
};
