import { RegisteredUserAppCommand } from "../DiscordAppCommand.js";
import { APIApplicationCommand, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { UserT } from "shared";
import { HWApi } from "@/hwApi.js";

export class CleanUpTeamCommand extends RegisteredUserAppCommand {
  valueOptions = { teamRole: true }
  listOptions = {}
  definition = {
    name: 'cleanupteam',
    description: 'Admin command to cleanup an inactive team.',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
    options: [
      {
        name: 'role',
        description: 'The team that you wish to cleanup',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  
  handler = async (invoker: UserT, opts) => {
    const { teamRole } = opts
    const hwApi = new HWApi(invoker)
    return await hwApi.cleanupTeam(teamRole);
  }
}