import {
  DiscordAppCommand,
  RegisteredUserAppCommand,
  TeamLeadAppCommand,
} from '../DiscordAppCommand.js'
import { discordApi } from '../../../discord/discordApi.js'
import { firebaseApi } from '../../../firebase/firebaseApi.js'
import {
  APIApplicationCommand,
  APIInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { UserT } from 'shared'
import { hackWeeklyDiscord } from '../../../discord/hackWeeklyDiscord.js'
import { HWApi } from '../../../hwApi.js'

export class LeaveTeamCommand extends RegisteredUserAppCommand {
  valueOptions = {}
  listOptions = {}
  definition = {
    name: 'leaveteam',
    description: 'Leave your current team',
    type: ApplicationCommandType.ChatInput,
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT) => {
    const hwApi = new HWApi(invoker)
    return await hwApi.removeUserFromTeam(invoker)
  }
}
