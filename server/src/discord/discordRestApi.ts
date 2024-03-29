/// <reference lib="dom" />

import { hackWeeklyDiscord } from './hackWeeklyDiscord.js'
import { DISCORD_BOT_PRIVATE_KEY } from '../secrets.js'
import {
  APIMessage,
  RESTGetAPIChannelMessagesResult,
} from 'discord-api-types/v10'
import { RateLimitError } from '@/error/RateLimitError.js'

// This is our API wrapper for interacting with discord REST API - add roles, create teams, etc.
const apiRoot = 'https://discord.com/api'

export function sleep(ms: number, props: any = undefined) {
  let res: any
  props?.signal?.addEventListener('abort', () => {
    res()
  })
  return new Promise((resolve, reject) => {
    res = resolve
    setTimeout(resolve, ms)
  })
}

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
    let tryNum = 0
    while (tryNum++ < 3) {
      try {
        return await this._request(method, path, body)
      } catch (e) {
        if (e instanceof RateLimitError) {
          await sleep(Number(e.message) * 1000)
          continue
        }
        await sleep(1000)
      }
    }
    throw new Error(`Retries exhausted for ${method} ${path}`)
  }
  async _request(method: string, path: string, body: any = undefined) {
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
      const respJson = await resp.json()
      if (method === 'DELETE' && respJson.code === 10007) {
        console.log('Call failed, but deleting unknown member - ok')
        return {}
      }
      const respTxt = JSON.stringify(respJson)
      console.log('Call failed')
      resp.headers.forEach((v, k) => {
        console.log(`${k}: ${v}`)
      })
      console.log(`body: ${respTxt}`)

      if (resp.headers.get('x-ratelimit-remaining') == '0') {
        throw new RateLimitError(resp.headers.get('x-ratelimit-reset-after'))
      }

      throw new Error(respTxt)
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
  async GetChannel(channelId: string) {
    const path = `/channels/${channelId}`
    return await this.request('GET', path)
  }
  async DeleteChannel(channelId: string) {
    const path = `/channels/${channelId}`
    return await this.request('DELETE', path)
  }
  async CreateChannel(channelName: string, categoryId: string) {
    const path = `/guilds/${this.guildId}/channels`
    return await this.request('POST', path, {
      name: channelName,
      type: 0,
      parent_id: categoryId,
    })
  }
}

export const discordRestApi = new DiscordRestApi()
