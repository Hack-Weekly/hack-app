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
  async getTeams() {
    return this.getRecords<TeamT>('teams')
  }
  async addTeam(team: TeamT) {
    return firestoreDb.collection('teams').add(team)
  }
}

export const firebaseApi = new FirebaseApi()
