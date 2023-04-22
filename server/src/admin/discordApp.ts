import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'

export type DiscordAppCommand = Partial<APIApplicationCommand>

// These are the commands that are available in the Discord app, like right clicking a user and clicking 'Recruit'
const teamLeadRoleId = '1088703565696081920'
const commands: DiscordAppCommand[] = [
  {
    name: 'Recruit',
    type: ApplicationCommandType.User,
    default_member_permissions: `0`,
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
  id: '1092652146077487175',
  commands,
}
