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
  valueOptions = { githubId: true }
  listOptions = {}
  definition = {
    name: 'register',
    description: 'Register as a new user',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'githubId',
        description: 'Your github ID',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (
    invoker: UserT,
    { invokerId, githubId, discordName, discordRolesIds }
  ) => {
    const hwApi = new HWApi(invoker)
    return await hwApi.register(
      invokerId,
      githubId,
      discordName,
      discordRolesIds
    )
  }
}
