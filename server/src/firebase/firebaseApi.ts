import { TeamT, UserT } from 'shared'
import { firestoreDb } from '../firebase.js'

class FirebaseApi {
  private async getRecords<T>(colName: string) {
    const col = firestoreDb.collection(colName)
    const snapshots = await col.get()
    //const snapshots = await Promise.all(refs.map((t) => t.get()))
    return snapshots.docs.map((sn) => ({ id: sn.id, ...sn.data() } as T))
  }
  async getUsers() {
    return this.getRecords<UserT>('users')
  }
  async getUser({
    firebaseId,
    discordId,
    githubId,
  }: {
    firebaseId?: string
    discordId?: string
    githubId?: string
  }) {
    const users = await this.getUsers()
    return users.find(
      (u) =>
        u.id === firebaseId ||
        u.githubId === githubId ||
        u.discordId === discordId
    )
  }
  async addUser(_user: UserT) {
    const user = { ..._user }
    delete user.id
    return firestoreDb.collection('users').add(user)
  }
  updateUser(_user: UserT) {
    const user = { ..._user }
    delete user.id
    return firestoreDb.collection('users').doc(_user.id).update(user)
  }

  async getTeams() {
    return this.getRecords<TeamT>('teams')
  }
  async getActiveTeams() {
    const teams = await this.getTeams()
    const users = await this.getUsers()
    const activeTeamIds = new Set(
      users.map((u) => u.team).filter((teamId) => teamId)
    )
    return teams.filter((t) => activeTeamIds.has(t.id))
  }
  async getTeam(id) {
    const teams = await this.getRecords<TeamT>('teams')
    return teams.find(
      (t) => t.id === id || t.discordRole === id || t.githubTeam === id
    )
  }
  async addTeam(_team: TeamT) {
    const team = { ..._team }
    delete team.id
    return firestoreDb.collection('teams').add(team)
  }
  updateTeam(_team: TeamT) {
    const team = { ..._team }
    delete team.id
    return firestoreDb.collection('teams').doc(_team.id).update(team)
  }
}

export const firebaseApi = new FirebaseApi()
