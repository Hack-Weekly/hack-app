import { TeamT, UserT } from 'shared'
import { firestoreDb } from '../firebase.js'

class FirebaseApi {
  private async getRecords<T>(colName: string) {
    const col = firestoreDb.collection(colName)
    const refs = await col.listDocuments()
    const snapshots = await Promise.all(refs.map((t) => t.get()))
    return snapshots.map((sn) => sn.data() as T)
  }
  async getUsers() {
    return this.getRecords<UserT>('users')
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
  //   async getUser({
  //     firebaseId,
  //     discordId,
  //     githubId,
  //   }: {
  //     firebaseId?: string
  //     discordId?: string
  //     githubId?: string
  //   }) {
  //     if ((firebaseId ? 1 : 0 + discordId ? 1 : 0 + githubId ? 1 : 0) !== 1) {
  //         throw new Error("Supply exactly valid id")
  //     }
  //     const users = await this.getRecords<UserT>('users')
  //     return users.find(u => u.)
  //   }
  async getTeams() {
    return this.getRecords<TeamT>('teams')
  }
  async addTeam(_team: TeamT) {
    const team = { ..._team }
    delete team.id
    return firestoreDb.collection('teams').add(team)
  }
}

export const firebaseApi = new FirebaseApi()
