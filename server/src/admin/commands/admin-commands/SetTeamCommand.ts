import {
  AdminAppCommand,
  DiscordAppCommand,
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
import { HWApi } from '@/hwApi.js'

export class SetTeamCommand extends AdminAppCommand {
  valueOptions = { user: true, team: true, silent: true }
  listOptions = {}
  definition = {
    name: 'setteam',
    description: "Admin command to set a user's team",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
    options: [
      {
        name: 'user',
        description: 'The user whose team you wish to set',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'team',
        description: 'The team to assign the selected user to',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
      {
        name: 'silent',
        description: 'If true, player will not be announced in team channel',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, { user, team, silent }) => {
    const targetUser = await firebaseApi.getUser({
      discordId: user,
    })
    if (!targetUser) {
      return {
        error: "Couldn't load target user data (ask them to /register?)",
      }
    }

    const targetTeam = await firebaseApi.getTeam(team)
    if (!targetTeam) {
      return {
        error: "Couldn't load target team",
      }
    }
    const hwApi = new HWApi(invoker)
    return await hwApi.addUserToTeam(targetUser, targetTeam, silent)
  }
}
