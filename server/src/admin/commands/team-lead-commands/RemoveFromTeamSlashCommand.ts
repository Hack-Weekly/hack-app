import { DiscordAppCommand, TeamLeadAppCommand } from '../DiscordAppCommand.js'
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

export class RemoveFromTeamSlashCommand extends TeamLeadAppCommand {
  valueOptions = { user: true }
  listOptions = {}
  definition = {
    name: 'removefromteam',
    description: 'Command to remove user from their team',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'user',
        description: 'The user to be removed',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, { user }) => {
    const targetUser = await firebaseApi.getUser({
      discordId: user,
    })
    if (!targetUser) {
      return {
        error: "Couldn't load target user data (ask them to /register?)",
      }
    }

    const hwApi = new HWApi(invoker)
    return await hwApi.removeUserFromTeam(targetUser)
  }
}
