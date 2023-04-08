// TODO: merge with web client types
export interface HWTeam {
  name: string
  discordTeamId: string
  githubTeamId: string
}

export const teams = {
  lavenderSnake: {
    name: 'Lavender Snake',
    discordTeamId: '1082092224327725136',
    githubTeamId: 'lavender-snake',
  },
  turquoiseCobra: {
    name: 'Turquoise Cobra',
    discordTeamId: '1082468691607830659',
    githubTeamId: 'turquoise-cobra',
  },
}

export const teamList = Object.values(teams)
