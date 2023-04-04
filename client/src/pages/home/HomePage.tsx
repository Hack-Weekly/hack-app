import { FC } from "react";
import { Link } from "react-router-dom";
import { TeamT } from "../../data-types/dataTypes";
import { useAppStore, useCurrentProject } from "../../global-state/globalState";

const CurrentProjectPanel: FC = () => {
  const currentProject = useCurrentProject();
  if (!currentProject) {
    return <div>No current project</div>;
  }
  return <div>The current project is "{currentProject?.description}"</div>;
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
    <div>
      <div>Current Teams</div>
      <div>
        {teams.map((t) => (
          <Team key={t.id} team={t} />
        ))}
      </div>
      <div>
        <Link to="teams/new">
          <button>Add team</button>
        </Link>
      </div>
    </div>
  );
};
const JoinPanel: FC = () => {
  return (
    <div>
      <div>Want to participate?</div>
      <div>
        <button>Sign up</button>
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
    <div>
      <CurrentProjectPanel />
      <TeamsPanel />
      <JoinPanel />
    </div>
  );
};
