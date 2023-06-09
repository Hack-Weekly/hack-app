import { FC } from "react";
import { Link } from "react-router-dom";
import { TeamT } from "shared";

import Button from "../../components/Button/Button";
import Carousel from "../../components/Carousel/Carousel";
import { useAppStore, useCurrentProject } from "../../global-state/globalState";
import styles from "./HomePage.module.css";

const CurrentProjectPanel: FC = () => {
  const currentProject = useCurrentProject();

  return (
    <div className={styles.currentProjectPanel}>
      <div className={styles.currentProject}>
        {currentProject ? (
          <p>
            The current project is: <br />"{currentProject.description}"
          </p>
        ) : (
          <p>There is no current project</p>
        )}
      </div>
    </div>
  );
};

const Team: FC<{ team: TeamT }> = ({ team }) => {
  return (
    <Link to={`teams/${team.id}`}>
      <div className={styles.teamCard}>{team.name}</div>
    </Link>
  );
};
const TeamsPanel: FC = () => {
  const teams = useAppStore((state) => state.teams);
  return (
    <div className={styles.teamsPanel}>
      <div className={styles.h2}>Current Teams</div>
      <Carousel
        items={teams.map((team) => (
          <Team key={team.id} team={team} />
        ))}
      />
      <Link to="teams/new">
        <Button className={styles.addTeam}>Add Team</Button>
      </Link>
    </div>
  );
};
const JoinPanel: FC = () => {
  return (
    <div className={styles.joinPanel}>
      <div>Want to participate?</div>
      <div>
        <Link to="/login">
          <Button>Sign up</Button>
        </Link>
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
