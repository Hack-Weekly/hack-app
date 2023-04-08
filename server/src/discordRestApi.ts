/// <reference lib="dom" />

import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { DISCORD_BOT_PRIVATE_KEY } from './secrets.js'

const apiRoot = 'https://discord.com/api'
class DiscordRestApi {
  guildId: string
  constructor() {
    this.guildId = hackWeeklyDiscord.id
  }
  async request(path: string) {
    const resp = await fetch(apiRoot + path, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_PRIVATE_KEY}`,
      },
    })

    if (!resp.ok) {
      console.log(resp)
      throw new Error(await resp.json())
    }

    return resp.status === 204 ? '{}' : await resp.json()
  }
  async AddRole(roleId: string, userId: string) {
    const path = `/guilds/${this.guildId}/members/${userId}/roles/${roleId}`
    return await this.request(path)
  }
}

export const discordRestApi = new DiscordRestApi()
