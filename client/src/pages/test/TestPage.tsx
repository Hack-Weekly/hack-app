import { uuidv4 } from "@firebase/util";
import { DateTime } from "luxon";
import { FC } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { HFlex, VFlex } from "../../utils";

interface TestStore {
  commandHistory: CommandInstance[];
  addCommand: (cmd: CommandInstance) => any;
  updateCommandStatus:  (command: CommandInstance, result: ResultT) => any;
}
export const useTestStore = create(
  immer<TestStore>((set) => ({
    commandHistory: [],
    addCommand: (command: CommandInstance) =>
      set((state) => ({ commandHistory: [...state.commandHistory, command] })),
    updateCommandStatus: (command: CommandInstance, result: ResultT) =>
      set((state) => {
        const cmd = state.commandHistory.find((c) => c.id === command.id)!;
        cmd.result = result;
        return state.commandHistory;
      }),
  }))
);

interface CommandT {
  name: string;
  run: () => Promise<void>;
}
const TestCommands = [
  {
    name: "Add to teamname",
    run: async () => {},
  },
  {
    name: "Remove from teamname",
    run: async () => {},
  },
  {
    name: "Promote to team lead",
    run: async () => {},
  },
  {
    name: "Demote from team lead",
    run: async () => {},
  },
] as CommandT[];

type ResultT = "pending" | "success" | "failure";
interface CommandInstance {
  id: string;
  commandName: string;
  start: DateTime;
  end?: DateTime;
  result: ResultT;
}
const useCommandHistory = () => useTestStore(state => state.commandHistory);
const useAddCommand = () => (cmd: CommandInstance) => {
    useTestStore(state => state.addCommand)
};
const useSetCommandResult = () => (cmd: CommandInstance, res: ResultT) => useTestStore(state => state.)
const CommandPanel = () => {
  const addCommand = useAddCommand();
  const setCommandResult = useSetCommandResult();
  const runCommand = async (cmd: CommandT) => {
    const inst: CommandInstance = {
      id: uuidv4(),
      commandName: cmd.name,
      start: DateTime.now(),
      result: "pending",
    };
    addCommand(inst);

    await cmd.run();
    setCommandResult(inst, "success");
  };
  return (
    <div>
      {TestCommands.map((cmd) => (
        <HFlex key={cmd.name}>
          <div style={{ flex: 1 }}>{cmd.name}</div>
          <button onClick={() => runCommand(cmd)}>Run</button>
        </HFlex>
      ))}
    </div>
  );
};

const CommandRecord: FC<{ commandInstance: CommandInstance }> = ({
  commandInstance,
}) => {
  let duration = "";
  if (commandInstance.end!) {
    const d = commandInstance.end!.diff(commandInstance.start);
    duration = `${d.milliseconds}ms`;
  }

  return (
    <div>
      {commandInstance.commandName} - {commandInstance.result} ({duration})
    </div>
  );
};
const Console = () => {
  const commandHistory = useCommandHistory();
  return (
    <div>
      {commandHistory.map((c) => (
        <CommandRecord key={c.id} commandInstance={c} />
      ))}
    </div>
  );
};

// Allow testing of the remote API
export const TestPage = () => {
  return (
    <HFlex>
      <VFlex>
        <CommandPanel />
      </VFlex>
      <VFlex>
        <Console />
        <div></div>
      </VFlex>
    </HFlex>
  );
};
