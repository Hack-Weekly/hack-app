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
  PrePurgeCommand,
  PurgeCommand,
  RecruitCommand,
  RegisterCommand,
  RemoveFromTeamCommand,
  RemoveFromTeamSlashCommand,
  SetGithubIdCommand,
  SetTeamCommand,
  SetTeamLeadCommand,
  ShowTeamCommand,
} from './commands/index.js'

export const commands: DiscordAppCommand[] = [
  new ShowTeamCommand(),
  new LFMCommand(),
  new RecruitCommand(),
  new RemoveFromTeamCommand(),
  new RemoveFromTeamSlashCommand(),
  new LFTCommand(),
  new LeaveTeamCommand(),
  new SetTeamCommand(),
  new SetTeamLeadCommand(),
  new SetGithubIdCommand(),
  new ContinueCommand(),
  new RegisterCommand(),
  new PurgeCommand(),
  new PrePurgeCommand(),
]

export const hackWeeklyDiscordApp = {
  id: hackWeeklyDiscord.botId,
  commands,
}
