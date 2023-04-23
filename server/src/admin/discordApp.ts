import { hackWeeklyDiscord } from '../discord/hackWeeklyDiscord.js'
import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { DiscordAppCommand } from './commands/DiscordAppCommand.js'
import {
  LeaveTeamCommand,
  LFMCommand,
  LFTCommand,
  RecruitCommand,
} from './commands/index.js'

export const commands: DiscordAppCommand[] = [
  new LFMCommand(),
  new RecruitCommand(),
  new LFTCommand(),
  new LeaveTeamCommand(),
]

// TODO: implement handler for this
// name: 'setteam',
// description: "Admin command to set a user's team",
// type: ApplicationCommandType.ChatInput,
// default_member_permissions: `0`,
// options: [
//   {
//     name: 'user',
//     description: 'The user whose team you wish to set',
//     type: ApplicationCommandOptionType.User,
//     required: true,
//   },
//   {
//     name: 'team',
//     description: 'The team to assign the selected user to',
//     type: ApplicationCommandOptionType.Role,
//     required: true,
//   },
// ],

export const hackWeeklyDiscordApp = {
  id: hackWeeklyDiscord.botId,
  commands,
}
