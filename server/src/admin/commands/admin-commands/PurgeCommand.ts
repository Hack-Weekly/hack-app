import { RegisteredUserAppCommand } from '../DiscordAppCommand.js'
import { discordApi } from '../../../discord/discordApi.js'
import { firebaseApi } from '../../../firebase/firebaseApi.js'
import {
  APIApplicationCommand,
  APIInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { UserT } from 'shared'
import { HWApi } from '@/hwApi.js'

export class PurgeCommand extends RegisteredUserAppCommand {
  valueOptions = {}
  listOptions = {}
  definition = {
    name: 'purge',
    description:
      "Admin command to remove users from teams that haven't affirmitively indicated they wish to continue",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT) => {
    const hwApi = new HWApi(invoker)
    return await hwApi.purge()
  }
}
