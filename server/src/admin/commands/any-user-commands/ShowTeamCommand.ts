import {DiscordAppCommand} from '../DiscordAppCommand.js'
import { firebaseApi } from '@/firebase/firebaseApi.js'
import {
    APIApplicationCommand,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10'
import { UserT } from 'shared'

export class ShowTeamCommand extends DiscordAppCommand {
    valueOptions = {team: true}
    listOptions = {}
    definition = {
        name: 'showteam',
        description:      'Show basic team information',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'team',
                description:
                    "The team you're looking for. (leave blank to show your own team)",
                type: ApplicationCommandOptionType.Role,
                required: false,
            },
        ],
    } as Partial<APIApplicationCommand>
    handler = async (invoker: UserT, { team }) => {
        const targetTeam = team ?  await firebaseApi.getTeam(team) : await firebaseApi.getTeam(invoker.team);
        if (!targetTeam) {
            return {
                error: "Couldn't load target team data",
            }
        }

        const users = await firebaseApi.getUsers();
        const teamUsers = users.filter(user => user.team === targetTeam.id);
        const teamUserDiscordIds = teamUsers.map(user => `<@${user.discordId}>`);

        return {
            message: `Team ${targetTeam.name} has ${teamUserDiscordIds.length} members: ${teamUserDiscordIds.join(', ')}`
        }
    }
}
