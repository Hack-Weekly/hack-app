/// <reference lib="dom" />

import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { DISCORD_BOT_PRIVATE_KEY } from '../secrets.js'
import {
  APIMessage,
  RESTGetAPIChannelMessagesResult,
} from 'discord-api-types/v10'

// This is our API wrapper for interacting with discord REST API - add roles, create teams, etc.
const apiRoot = 'https://discord.com/api'
export class DiscordUserRestApi {
  token: string
  constructor(token: string) {
    this.token = token
  }

  async getUserData() {
    const resp = await fetch(apiRoot + '/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!resp.ok) {
      console.log(resp)
      throw new Error(await resp.json())
    }

    return resp.status === 204 ? '{}' : await resp.json()
  }
}
class DiscordRestApi {
  guildId: string
  constructor() {
    this.guildId = hackWeeklyDiscord.id
  }
  async request(method: string, path: string, body: any = undefined) {
    const bodyObj = body ? { body: JSON.stringify(body) } : {}
    console.log(
      `Calling ${method} ${path} with content ${JSON.stringify(bodyObj)}`
    )
    const resp = await fetch(apiRoot + path, {
      method: method,
      headers: {
        Authorization: `Bot ${DISCORD_BOT_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      ...bodyObj,
    })

    if (!resp.ok) {
      console.log(`Call failed with ${JSON.stringify(resp)}`)
      throw new Error(await resp.json())
    }

    console.log('Call succeeded')
    return resp.status === 204 ? '{}' : await resp.json()
  }
  async getGuildMember(userId: string) {
    const path = `/guilds/${this.guildId}/members/${userId}`
    return await this.request('GET', path)
  }
  async getGuildMembers() {
    const limit = 1000 //  max. limit as mentioned by the docs: https://discord.com/developers/docs/resources/guild#list-guild-members
    let path = `/guilds/${this.guildId}/members?limit=${limit}`
    let serverUsers = await this.request('GET', path)
    while (serverUsers.length % limit === 0) {
      path = `/guilds/${this.guildId}/members?limit=${limit}&after=${
        serverUsers[serverUsers.length - 1].user.id
      }`
      serverUsers = [...serverUsers, ...(await this.request('GET', path))]
    }
    return serverUsers
  }
  async AddRole(roleId: string, userId: string) {
    const path = `/guilds/${this.guildId}/members/${userId}/roles/${roleId}`
    return await this.request('PUT', path)
  }
  async RemoveRole(roleId: string, userId: string) {
    const path = `/guilds/${this.guildId}/members/${userId}/roles/${roleId}`
    return await this.request('DELETE', path)
  }

  // Messaging
  GetMessages(channelId: string) {
    const path = `/channels/${channelId}/messages`
    return this.request('GET', path) as Promise<APIMessage[]>
  }
  async MessageChannel(channelId: string, message: string) {
    const path = `/channels/${channelId}/messages`
    return await this.request('POST', path, {
      content: message,
    })
  }
  async EditMessage(channelId: string, messageId: string, newMessage: string) {
    const path = `/channels/${channelId}/messages/${messageId}`
    return await this.request('PATCH', path, {
      content: newMessage,
    })
  }
  async DeleteMessage(channelId: string, messageId: string) {
    const path = `/channels/${channelId}/messages/${messageId}`
    return await this.request('DELETE', path)
  }
}

export const discordRestApi = new DiscordRestApi()
