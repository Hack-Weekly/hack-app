import { createContext, FC, useContext } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ImplementationT, ProjectT, TeamT, UserIdT, UserT } from "shared";
import {
  useAppStore,
  useCurrentProject,
  useProject,
  useTeam,
  useUser,
  useUsers,
} from "../../global-state/globalState";
import styles from "./TeamPage.module.css";
import Button from "../../components/Button/Button";

const TeamContext = createContext<TeamT>({} as any);
const useCurTeam = () => useContext(TeamContext);

const Member: FC<{ user: UserT }> = ({ user }) => {
  return <div>{user?.name}</div>;
};

const MembersPanel: FC = () => {
  const curTeam = useCurTeam();
  const members = Object.values(useUsers()).filter(
    (u) => u.team === curTeam.id
  );

  return (
    <div className={styles.root}>
      <div>Members</div>
      <div>
        {members.map((m) => (
          <Member key={m.id} user={m} />
        ))}
      </div>
    </div>
  );
};

const Project: FC<{ implementation: ImplementationT }> = ({
  implementation,
}) => {
  const project = useProject(implementation.projectId);
  return (
    <Link to={`projects/${implementation.id}`}>
      <div>{project?.description}</div>
    </Link>
  );
};
const ProjectsPanel: FC = () => {
  const curTeam = useCurTeam();
  const implementations = useAppStore((state) => state.implementations).filter(
    (imp) => imp.teamId === curTeam.id
  );

  return (
    <div>
      <div>Projects</div>
      <div>
        {implementations.map((impl) => (
          <Project key={impl.id} implementation={impl} />
        ))}
      </div>
    </div>
  );
};
const JoinPanel: FC = () => {
  return (
    <div>
      <div>Want to join this team?</div>
      <div>
        <Button className={styles.button}>Apply</Button>
      </div>
    </div>
  );
};

export const TeamPage: FC = (props) => {
  const teamId = useLoaderData() as any;
  const team = useTeam(teamId);
  if (team === undefined) {
    return <div>Invalid team</div>;
  }
  return (
    <TeamContext.Provider value={team}>
      <div>
        <MembersPanel />
        <ProjectsPanel />
        <JoinPanel />
      </div>
    </TeamContext.Provider>
  );
};
