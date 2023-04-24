import { discordApi } from '../../discord/discordApi.js'
import { firebaseApi } from '../../firebase/firebaseApi.js'
import {
  APIApplicationCommand,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionType,
} from 'discord-api-types/v10'
import { UserT } from 'shared'
import { LFMCommand } from './team-lead-commands/LFMCommand.js'

export abstract class DiscordAppCommand {
  abstract definition: Partial<APIApplicationCommand> // this is what gets registered to discord
  abstract valueOptions: Record<string, any>
  abstract listOptions: Record<string, any>
  canAccess = (user: UserT) => true
  abstract handler: (user: UserT, options: any) => any

  get command() {
    return this.definition.name
  }

  parseOptions(payload: APIInteraction) {
    const payloadOptions: any[] = (payload as any).data?.options ?? []
    // look for unsupported options
    const invalid = payloadOptions.find(
      (o) => !this.valueOptions[o.name] && !this.listOptions[o.name]
    )
    if (invalid) {
      return { error: `Option '${invalid.name}' not supported` }
    }

    const options = {
      targetUserDiscordId: (payload as APIUserApplicationCommandInteraction)
        .data.target_id,
    }
    for (const option of payloadOptions) {
      const valueHandler = this.valueOptions[option.name]
      const listHandler = this.listOptions[option.name]
      const res = valueHandler
        ? valueHandler === true
          ? option.value
          : valueHandler(option.value)
        : parseOptionList(listHandler, option)
      if (res.error) {
        return res
      }

      options[option.name] = res
    }

    return options
  }

  async execute(payload: APIInteraction) {
    const options = this.parseOptions(payload)
    if (options.error) return options

    const invoker = await firebaseApi.getUser({
      discordId: payload.member.user.id,
    })
    if (!invoker) {
      return {
        error: "Couldn't load your data - maybe you need to run /register?",
      }
    }
    return await this.handler(invoker, options)
  }
}

export abstract class RegisteredUserAppCommand extends DiscordAppCommand {
  canAccess = (user: UserT) => !!user
}

export abstract class TeamLeadAppCommand extends DiscordAppCommand {
  canAccess = (user: UserT) => user?.teamLead
}

export abstract class AdminAppCommand extends DiscordAppCommand {
  canAccess = (user: UserT) => user?.admin
}

const parseOptionList = (validValues: any, option: any) => {
  const value = option?.value.replace(' ', '')
  if (!value) {
    return { error: `No value supplied for option ${option.name}` }
  }

  const valueList = value.toLowerCase().split(',')
  const invalid = valueList.find((v) => validValues[v] === undefined)
  if (invalid) {
    return { error: `Invalid value: '${invalid}'` }
  }
  if (new Set(valueList).size !== valueList.length) {
    return { error: `Duplicate value found in ${option.name}` }
  }

  return valueList.map((v) => validValues[v])
}
