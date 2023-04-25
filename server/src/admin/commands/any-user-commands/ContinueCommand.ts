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

export class ContinueCommand extends DiscordAppCommand {
  valueOptions = { githubId: true }
  listOptions = {}
  definition = {
    name: 'continue',
    description: 'Continue with your current team for the next project',
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
    // This might fail because user already exists, which is fine
    const registerRes = await hwApi.register(
      invokerId,
      githubId,
      discordName,
      discordRolesIds
    )
    console.log(`Continue registration result ${JSON.stringify(registerRes)}`)

    const user = await firebaseApi.getUser({ discordId: invokerId })
    if (!user) {
      return { error: 'User could not be found' }
    }

    user.continueStatus = 'confirmed'
    await firebaseApi.updateUser(user)
    return { message: 'User updated successfully' }
  }
}
