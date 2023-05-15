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

export class SetTeamLeadCommand extends RegisteredUserAppCommand {
  valueOptions = { user: true, teamlead: true }
  listOptions = {}
  definition = {
    name: 'setteamlead',
    description: 'Admin command to add or remove Team Lead roll',
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
        name: 'teamlead',
        description: 'Whether specified user should be a team lead',
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, opts) => {
    const { user, teamlead } = opts
    const targetUser = await firebaseApi.getUser({
      discordId: user,
    })
    if (!targetUser) {
      return {
        error: "Couldn't load target user data (ask them to /register?)",
      }
    }
    const hwApi = new HWApi(invoker)
    return await hwApi.setTeamLead(targetUser, teamlead)
  }
}
