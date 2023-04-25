import { hackWeeklyDiscord } from '../discord/hackWeeklyDiscord.js'
import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { DiscordAppCommand } from './commands/DiscordAppCommand.js'
import {
  ContinueCommand,
  LeaveTeamCommand,
  LFMCommand,
  LFTCommand,
  RecruitCommand,
  RegisterCommand,
  RemoveFromTeamCommand,
  RemoveFromTeamSlashCommand,
  SetTeamCommand,
} from './commands/index.js'

export const commands: DiscordAppCommand[] = [
  new LFMCommand(),
  new RecruitCommand(),
  new RemoveFromTeamCommand(),
  new RemoveFromTeamSlashCommand(),
  new LFTCommand(),
  new LeaveTeamCommand(),
  new SetTeamCommand(),
  new ContinueCommand(),
  new RegisterCommand(),
]

export const hackWeeklyDiscordApp = {
  id: hackWeeklyDiscord.botId,
  commands,
}
