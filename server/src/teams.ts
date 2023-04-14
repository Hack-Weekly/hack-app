// TODO: merge with web client types
export interface HWTeam {
  name: string
  discordTeamId: string
  githubTeamId: string
}

// This is meant to be a temporary full list of teams - eventually we move to firebase as source of truth
export const teams = {
  azureLobster: {
    name: 'Azure Lobster',
    discordTeamId: '1082088003750596728',
    githubTeamId: 'azure-lobster',
  },
  bronzeBadger: {
    name: 'Bronze Badger',
    discordTeamId: '1085366474593550367',
    githubTeamId: 'bronze-badger',
  },
  ceruleanLion: {
    name: 'Cerulean Lion',
    discordTeamId: '1085366857797746729',
    githubTeamId: 'cerulean-lion',
  },
  copperMarmot: {
    name: 'Copper Marmot',
    discordTeamId: '1083404866296238120',
    githubTeamId: 'copper-marmot',
  },
  crimsonEagle: {
    name: 'Crimson Eagle',
    discordTeamId: '1082089615151878164',
    githubTeamId: 'crimson-eagle',
  },
  emeraldChameleon: {
    name: 'Emerald Chameleon',
    discordTeamId: '1082089331705008140',
    githubTeamId: 'emerald-chameleon',
  },
  fireKangaroo: {
    name: 'Fire Kangaroo',
    discordTeamId: '1085365117912363149',
    githubTeamId: 'fire-kangaroo',
  },
  fuchsiaCuttlefish: {
    name: 'Fuchsia Cuttlefish',
    discordTeamId: '1085372302063042570',
    githubTeamId: 'fuchsia-cuttlefish',
  },
  goldenDragon: {
    name: 'Golden Dragon',
    discordTeamId: '1082091769782607984',
    githubTeamId: 'golden-dragon',
  },
  greenBearcat: {
    name: 'Green Bearcat',
    discordTeamId: '1090407232627286016',
    githubTeamId: 'green-bearcat',
  },
  greyUnicorn: {
    name: 'Grey Unicorn',
    discordTeamId: '1082093240234295377',
    githubTeamId: 'grey-unicorn',
  },
  indigoTurtle: {
    name: 'Indigo Turtle',
    discordTeamId: '1082871181272690728',
    githubTeamId: 'indigo-turtle',
  },
  lavenderSnake: {
    name: 'Lavender Snake',
    discordTeamId: '1082092224327725136',
    githubTeamId: 'lavender-snake',
  },
  magentaTiger: {
    name: 'Magenta Tiger',
    discordTeamId: '1082092699894698045',
    githubTeamId: 'magenta-tiger',
  },
  malichiteToad: {
    name: 'Malichite Toad',
    discordTeamId: '1085368396067131524',
    githubTeamId: 'malichite-toad',
  },
  mintPanda: {
    name: 'Mint Panda',
    discordTeamId: '1082093803000840272',
    githubTeamId: 'mint-panda',
  },
  onyxSalamander: {
    name: 'Onyx Salamander',
    discordTeamId: '1085373686112059433',
    githubTeamId: 'onyx-salamander',
  },
  saffronWolf: {
    name: 'Saffron Wolf',
    discordTeamId: '1085374516244520990',
    githubTeamId: 'saffron-wolf',
  },
  sageGiraffe: {
    name: 'Sage Giraffe',
    discordTeamId: '1082470728416362627',
    githubTeamId: 'sage-giraffe',
  },
  tangerineMoose: {
    name: 'Tangerine Moose',
    discordTeamId: '1082093577779298474',
    githubTeamId: 'tangerine-moose',
  },
  turquoiseCobra: {
    name: 'Turquoise Cobra',
    discordTeamId: '1082468691607830659',
    githubTeamId: 'turquoise-cobra',
  },
  vermillionLlama: {
    name: 'Vermillion Llama',
    discordTeamId: '1085370179078336593',
    githubTeamId: 'vermillion-llama',
  },
}

export const teamList = Object.values(teams)
