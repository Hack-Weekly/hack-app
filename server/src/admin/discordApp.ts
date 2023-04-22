import { hackWeeklyDiscord } from '../discord/hackWeeklyDiscord.js'
import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'

export type DiscordAppCommand = Partial<APIApplicationCommand>

// These are the commands that are available in the Discord app, like right clicking a user and clicking 'Recruit'
const commands: DiscordAppCommand[] = [
  {
    name: 'Recruit',
    type: ApplicationCommandType.User,
    default_member_permissions: `0`,
  },
  {
    // TODO: implement handler for this
    name: 'setteam',
    description: "Admin command to set a user's team",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
    options: [
      {
        name: 'user',
        description: 'The user whose team you wish to set',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'team',
        description: 'The team to assign the selected user to',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
  },
  {
    // TODO: implement handler for this
    name: 'lft',
    description:
      'Signify that you are looking for a team (/leaveteam before doing this)',
    type: ApplicationCommandType.ChatInput,
  },
  {
    name: 'leaveteam',
    description: 'Leave your current team',
    type: ApplicationCommandType.ChatInput,
  },
  {
    name: 'register',
    description: 'Register with Hack Weekly',
    type: ApplicationCommandType.ChatInput,
  },
]

export const hackWeeklyDiscordApp = {
  id: hackWeeklyDiscord.botId,
  commands,
}
