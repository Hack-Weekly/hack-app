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
    defaultChannel: '1099229387678830653',
  },
  bronzeBadger: {
    name: 'Bronze Badger',
    discordTeamId: '1085366474593550367',
    githubTeamId: 'bronze-badger',
    defaultChannel: '1099229688221679696',
  },
  ceruleanLion: {
    name: 'Cerulean Lion',
    discordTeamId: '1085366857797746729',
    githubTeamId: 'cerulean-lion',
    defaultChannel: '1099229910737883186',
  },
  copperMarmot: {
    name: 'Copper Marmot',
    discordTeamId: '1083404866296238120',
    githubTeamId: 'copper-marmot',
    defaultChannel: '1099229161912012921',
  },
  crimsonEagle: {
    name: 'Crimson Eagle',
    discordTeamId: '1082089615151878164',
    githubTeamId: 'crimson-eagle',
    defaultChannel: '1082096384120983593',
  },
  emeraldChameleon: {
    name: 'Emerald Chameleon',
    discordTeamId: '1082089331705008140',
    githubTeamId: 'emerald-chameleon',
    defaultChannel: '1082096340072411258',
  },
  fireKangaroo: {
    name: 'Fire Kangaroo',
    discordTeamId: '1085365117912363149',
    githubTeamId: 'fire-kangaroo',
    defaultChannel: '1099229808837275668',
  },
  fuchsiaCuttlefish: {
    name: 'Fuchsia Cuttlefish',
    discordTeamId: '1085372302063042570',
    githubTeamId: 'fuchsia-cuttlefish',
    defaultChannel: '1099230067520966766',
  },
  goldenDragon: {
    name: 'Golden Dragon',
    discordTeamId: '1082091769782607984',
    githubTeamId: 'golden-dragon',
    defaultChannel: '1099229029862756383',
  },
  greenBearcat: {
    name: 'Green Bearcat',
    discordTeamId: '1090407232627286016',
    githubTeamId: 'green-bearcat',
    defaultChannel: '1090408113875734619',
  },
  greyUnicorn: {
    name: 'Grey Unicorn',
    discordTeamId: '1082093240234295377',
    githubTeamId: 'grey-unicorn',
    defaultChannel: '1099229240941092875',
  },
  indigoTurtle: {
    name: 'Indigo Turtle',
    discordTeamId: '1082871181272690728',
    githubTeamId: 'indigo-turtle',
    defaultChannel: '1082872612268556348',
  },
  lavenderSnake: {
    name: 'Lavender Snake',
    discordTeamId: '1082092224327725136',
    githubTeamId: 'lavender-snake',
    defaultChannel: '1082096445278146663',
  },
  magentaTiger: {
    name: 'Magenta Tiger',
    discordTeamId: '1082092699894698045',
    githubTeamId: 'magenta-tiger',
    defaultChannel: '1082096473417715772',
  },
  malachiteToad: {
    name: 'Malachite Toad',
    discordTeamId: '1085368396067131524',
    githubTeamId: 'malachite-toad',
    defaultChannel: '1098780259488387165',
  },
  mintPanda: {
    name: 'Mint Panda',
    discordTeamId: '1082093803000840272',
    githubTeamId: 'mint-panda',
    defaultChannel: '1099229612862611506',
  },
  onyxSalamander: {
    name: 'Onyx Salamander',
    discordTeamId: '1085373686112059433',
    githubTeamId: 'onyx-salamander',
    defaultChannel: '1090483188389908500',
  },
  saffronWolf: {
    name: 'Saffron Wolf',
    discordTeamId: '1085374516244520990',
    githubTeamId: 'saffron-wolf',
    defaultChannel: '1099229315801034764',
  },
  sageGiraffe: {
    name: 'Sage Giraffe',
    discordTeamId: '1082470728416362627',
    githubTeamId: 'sage-giraffe',
    defaultChannel: '1099229746295996466',
  },
  tangerineMoose: {
    name: 'Tangerine Moose',
    discordTeamId: '1082093577779298474',
    githubTeamId: 'tangerine-moose',
    defaultChannel: '1082096522218455130',
  },
  turquoiseCobra: {
    name: 'Turquoise Cobra',
    discordTeamId: '1082468691607830659',
    githubTeamId: 'turquoise-cobra',
    defaultChannel: '1082469926356398201',
  },
  vermillionLlama: {
    name: 'Vermillion Llama',
    discordTeamId: '1085370179078336593',
    githubTeamId: 'vermillion-llama',
    defaultChannel: '1099229997346078752',
  },
}

export const teamList = Object.values(teams)
