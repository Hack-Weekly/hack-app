import {
  APIApplicationCommand,
  ApplicationCommandType,
} from 'discord-api-types/v10'

export type DiscordAppCommand = Partial<APIApplicationCommand>

const teamLeadRoleId = '1088703565696081920'
const commands: DiscordAppCommand[] = [
  {
    name: 'Recruit',
    type: ApplicationCommandType.User,
    default_member_permissions: `0`,
  },
]

export const hackWeeklyDiscordApp = {
  id: '1092652146077487175',
  commands,
}
