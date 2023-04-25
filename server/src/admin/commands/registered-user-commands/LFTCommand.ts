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

export class LFTCommand extends RegisteredUserAppCommand {
  valueOptions = { blurb: (b: any) => (b ? b : { error: 'Empty blurb found' }) }
  listOptions = {}
  definition = {
    name: 'lft',
    description:
      'Signify that you are looking for a team (/leaveteam before doing this)',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'blurb',
        description:
          "A short (60 char) description of your skillset/what you're looking for",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  } as Partial<APIApplicationCommand>
  handler = async (invoker: UserT, { blurb }) => {
    invoker.lft = { blurb }
    await firebaseApi.updateUser(invoker)
    discordApi.updateLFGpost() // not awaiting - want to return quickly

    return { message: 'Updated team LFT status' }
  }
}
