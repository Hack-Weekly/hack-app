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

export class LFMCommand extends RegisteredUserAppCommand {
  valueOptions = { blurb: (b: any) => (b ? b : { error: 'Empty blurb found' }) }
  listOptions = {
    experience: { beg: 1, int: 2, adv: 3 },
    timezone: { na: 'NA', eu: 'EU', asia: 'Asia' },
  }
  definition = {
    name: 'lfm',
    description: 'Signify that your team is looking for members',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'blurb',
        description: "A short (60 char) description of your team's tech stack",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'experience',
        description:
          "Comma separated list of experience levels you're looking for. Ex: 'beg', 'int,adv', etc",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'timezone',
        description:
          "Comma separated list of regional timezones you're looking for. Ex: 'NA', 'EU,Asia', etc",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, { blurb, experience, timezone }) => {
    const team = await firebaseApi.getTeam(invoker.team)
    if (!team) {
      return { error: `Couldn't load team '${invoker.team}'` }
    }

    const hwApi = new HWApi(invoker)
    return await hwApi.setLFM(team, blurb, experience, timezone)
  }
}
