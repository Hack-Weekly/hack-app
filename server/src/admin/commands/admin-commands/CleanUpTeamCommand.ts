import { RegisteredUserAppCommand } from '../DiscordAppCommand.js'
import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { UserT } from 'shared'
import { HWApi } from '@/hwApi.js'
import { firebaseApi } from '@/firebase/firebaseApi.js'

export class CleanUpTeamCommand extends RegisteredUserAppCommand {
  valueOptions = { team: true }
  listOptions = {}
  definition = {
    name: 'cleanupteam',
    description: 'Admin command to cleanup an inactive team.',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: `0`,
    options: [
      {
        name: 'team',
        description: 'The team that you wish to cleanup',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>

  handler = async (invoker: UserT, opts) => {
    const { team } = opts
    console.log(`Looking for team ${team}`)

    const targetTeam = await firebaseApi.getTeam(team)

    if (!targetTeam) {
      return {
        error: 'Team associated to the role not found',
      }
    }

    const hwApi = new HWApi(invoker)
    return await hwApi.cleanupTeam(team)
  }
}
