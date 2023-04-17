import { FC } from "react";
import { Link } from "react-router-dom";
import { TeamT } from "../../data-types/dataTypes";
import { useAppStore, useCurrentProject } from "../../global-state/globalState";
import styles from "./HomePage.module.css";
import Button from "../../components/Button/Button";

const CurrentProjectPanel: FC = () => {
  const currentProject = useCurrentProject();
  if (!currentProject) {
    return <div>No current project</div>;
  }
  return (
    <div className={styles.currentProject}>
      The current project is: <br />"{currentProject?.description}"
    </div>
  );
};

const Team: FC<{ team: TeamT }> = ({ team }) => {
  return (
    <Link to={`teams/${team.id}`}>
      <div>{team.name}</div>
    </Link>
  );
};
const TeamsPanel: FC = () => {
  const teams = useAppStore((state) => state.teams);

  return (
    <div className={styles.teamsPanel}>
      <div className={styles.h2}>Current Teams</div>
      <div className={styles.teams}>
        {teams.map((t) => (
          <Team key={t.id} team={t} />
        ))}
      </div>
      <div>
        <Link to="teams/new">
          <Button className={styles.addTeam}>Add Team</Button>
        </Link>
      </div>
    </div>
  );
};
const JoinPanel: FC = () => {
  return (
    <div className={styles.joinPanel}>
      <div>Want to participate?</div>
      <div>
        <Button>Sign up</Button>
      </div>
      <div>
        <div>All skill levels welcome, from mentors to new devs</div>
        <div>No cost or money required!</div>
      </div>
    </div>
  );
};

export const HomePage: FC = () => {
  return (
    <div className={styles.container}>
      <CurrentProjectPanel />
      <TeamsPanel />
      <JoinPanel />
    </div>
  );
};
