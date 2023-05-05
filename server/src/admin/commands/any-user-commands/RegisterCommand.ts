import { DiscordAppCommand } from '../DiscordAppCommand.js'
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

export class RegisterCommand extends DiscordAppCommand {
  valueOptions = { githubid: true }
  listOptions = {}
  definition = {
    name: 'register',
    description: 'Register as a new user',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'githubid',
        description: 'Your github ID',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (
    invoker: UserT,
    { invokerId, githubid, discordName, discordRolesIds }
  ) => {
    return await HWApi.register(
      invokerId,
      githubid,
      discordName,
      discordRolesIds
    )
  }
}
