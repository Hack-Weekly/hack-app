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
    name: 'lft',
    description:
      'Signify that you are looking for a team (/leaveteam before doing this)',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'blurb',
        description:
          "A short (60 char) description of your skillset/what you're looking for",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: 'lfm',
    description: 'Signify that your team is looking for members',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'blurb',
        description: "A short (60 char) description of your team's tech stack",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'experience',
        description:
          "Comma separated list of experience levels you're looking for. Ex: 'beg', 'int,adv', etc",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'timezone',
        description:
          "Comma separated list of regional timezones you're looking for. Ex: 'NA', 'EU,Asia', etc",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
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
    options: [
      {
        name: 'githubid',
        description: "Your current Github ID (e.g., 'rollie42')",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
]

export const hackWeeklyDiscordApp = {
  id: hackWeeklyDiscord.botId,
  commands,
}
