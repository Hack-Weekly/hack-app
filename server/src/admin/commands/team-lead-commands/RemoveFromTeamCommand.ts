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

export class RemoveFromTeamCommand extends TeamLeadAppCommand {
  valueOptions = {}
  listOptions = {}
  definition = {
    name: 'RemoveFromTeam',
    type: ApplicationCommandType.User,
    default_member_permissions: `0`,
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, { targetUserDiscordId }) => {
    const targetUser = await firebaseApi.getUser({
      discordId: targetUserDiscordId,
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
