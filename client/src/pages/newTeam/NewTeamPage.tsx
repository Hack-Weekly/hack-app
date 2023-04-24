import { createContext, FC, useContext, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ImplementationT, ProjectT, TeamT, UserIdT } from "shared";
import { createTeam } from "../../global-state/firebaseApi";
import {
  useAppStore,
  useCurrentProject,
  useProject,
  useUser,
} from "../../global-state/globalState";
import { createCtx } from "../../utils";
import styles from "./NewTeamPage.module.css";
import Button from "../../components/Button/Button";

const [useTeam, useSetTeam, TeamContext] = createCtx<Partial<TeamT>>();

export const NewTeamPage: FC = () => {
  const [name, setName] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [icon, setIcon] = useState("");
  const [result, setResult] = useState("");

  const create = async () => {
    // TODO
    const team: TeamT = {
      id: "",
      name,
      icon,
      discordRole: discordName,
      repos: [],
      githubTeam: "",
      defaultDiscordChannel: "",
      lfm: null,
    };

    try {
      await createTeam(team);
      setResult("Added!");
      setName("");
      setDiscordName("");
    } catch (e) {
      console.log("failed to create team", e);
      setResult("Failed to create team");
    }
  };

  return (
    <TeamContext defaultValue={{}}>
      <div className={styles.root}>
        <div>
          <div>Name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div>Discord team</div>
          <input
            type="text"
            value={discordName}
            onChange={(e) => setDiscordName(e.target.value)}
          />
        </div>
        <Button onClick={create} className={styles.button}>
          Create
        </Button>
        <div>{result}</div>
      </div>
    </TeamContext>
  );
};
