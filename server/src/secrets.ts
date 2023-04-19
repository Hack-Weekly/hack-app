export const DISCORD_BOT_PRIVATE_KEY = process.env.DISCORD_BOT_PRIVATE_KEY
export const DISCORD_APP_PRIVATE_KEY = process.env.DISCORD_APP_PRIVATE_KEY
export const GITHUB_PRIVATE_KEY =
  process.env.GITHUB_PRIVATE_KEY?.split('~')?.join('\n')
