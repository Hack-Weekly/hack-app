/// <reference lib="dom" />

import { DISCORD_APP_PRIVATE_KEY, DISCORD_BOT_PRIVATE_KEY } from '../secrets.js'
import { hackWeeklyDiscord } from '../discord/hackWeeklyDiscord.js'
import { hackWeeklyDiscordApp } from './discordApp.js'
import { APIApplicationCommand } from 'discord-api-types/v10'

// This is a wrapper around Discords API to modify an application - in our case, just adding/updating commands
const apiRoot = `https://discord.com/api/v10/applications/${hackWeeklyDiscordApp.id}/`
class DiscordAppApi {
  async AddCommand(cmd: Partial<APIApplicationCommand>) {
    const resp = await fetch(apiRoot + 'commands', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      // Bearer PBlilGVSIV3W4XYk8rQcPLSPn4X1Bj
      body: JSON.stringify(cmd),
    })

    if (!resp.ok) {
      const errorJson = await resp.json()
      console.log(JSON.stringify(errorJson))
      throw new Error(errorJson)
    }

    return resp.status === 204 ? '{}' : await resp.json()
  }

  async AddAllCommands() {
    for (const cmd of hackWeeklyDiscordApp.commands
      .map((c) => c.definition)
      .filter((c) => c.name === 'setteam')) {
      console.log(`Registering cmd "${cmd.name}"`)
      const res = await this.AddCommand(cmd)
      console.log(res)
    }
  }
}

export const discordAppApi = new DiscordAppApi()
