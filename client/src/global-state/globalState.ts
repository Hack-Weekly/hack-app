import {
  CollectionReference,
  onSnapshot,
  query,
  Timestamp,
} from "firebase/firestore";
import { create } from "zustand";
import {
  ImplementationT,
  ProjectIdT,
  ProjectT,
  RepoT,
  TeamIdT,
  TeamT,
  UserIdT,
  UserT,
} from "shared";

export const useCurrentUser = create<UserT | undefined>((set) => undefined);

interface AppStore {
  users: UserT[];
  setUsers: (_users: UserT[]) => any;
  teams: TeamT[];
  setTeams: (_teams: TeamT[]) => any;
  repos: RepoT[];
  setRepos: (_repos: RepoT[]) => any;
  projects: ProjectT[];
  setProjects: (_projects: ProjectT[]) => any;
  implementations: ImplementationT[];
  setImplementations: (_implementations: ImplementationT[]) => any;
  currentUser: UserT | null;
  setCurrentUser: (_user: UserT | null) => any;
}

export const useAppStore = create<AppStore>((set) => ({
  users: [],
  setUsers: (_users: UserT[]) => set(() => ({ users: _users })),
  teams: [],
  setTeams: (_teams: TeamT[]) => set(() => ({ teams: _teams })),
  repos: [],
  setRepos: (_repos: RepoT[]) => set(() => ({ repos: _repos })),
  projects: [],
  setProjects: (_projects: ProjectT[]) => set(() => ({ projects: _projects })),
  implementations: [],
  setImplementations: (_implementations: ImplementationT[]) =>
    set(() => ({ implementations: _implementations })),
  currentUser: null,
  setCurrentUser: (_user: UserT | null) => set(() => ({ currentUser: _user })),
}));

export const useDbSync = (
  collection: CollectionReference,
  storeKey: keyof AppStore
) => {
  const setFn = useAppStore((state) => state[storeKey]) as any;
  return () =>
    onSnapshot(query(collection), (snap) => {
      const datas = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setFn(datas);
    });
};

export const useCurrentProject = () => {
  const projects = useAppStore((state) => state.projects);
  return projects.find((p) => {
    const now = Timestamp.now();
    return now > p.startDate && now < p.endDate;
  });
};

export const useTeams = () => useAppStore((state) => state.teams);
export const useTeam = (id: TeamIdT) => {
  const teams = useAppStore((state) => state.teams);
  return teams.find((t) => t.id === id);
};
export const useUsers = () => useAppStore((state) => state.users);
export const useUser = (id: UserIdT) => {
  const users = useAppStore((state) => state.users);
  return users.find((u) => u.id === id);
};

export const useProject = (id: ProjectIdT) => {
  const projects = useAppStore((state) => state.projects);
  return projects.find((p) => p.id === id);
};
