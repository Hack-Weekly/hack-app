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

export class SetGithubIdCommand extends RegisteredUserAppCommand {
  valueOptions = { user: true, githubid: true }
  listOptions = {}
  definition = {
    name: 'setgithubid',
    description: "Admin command to set a user's github id",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
    options: [
      {
        name: 'user',
        description: 'The user whose status you wish to set',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'githubid',
        description: "User's new github ID",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, opts) => {
    const { user, githubid } = opts
    const targetUser = await firebaseApi.getUser({
      discordId: user,
    })
    if (!targetUser) {
      return {
        error: "Couldn't load target user data (ask them to /register?)",
      }
    }
    const hwApi = new HWApi(invoker)
    return await hwApi.setGithubId(targetUser, githubid)
  }
}
