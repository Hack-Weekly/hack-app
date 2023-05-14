import { Chess } from 'chess.js'
import { firestoreDb } from '../firebase.js'
import { ChessGame as ChessGame } from './proj4Types.js'
import { Timestamp } from 'firebase-admin/firestore'

const gamesCol = firestoreDb.collection('proj4_games')
const pgnCol = firestoreDb.collection('proj4_pgn')

class Proj4FirebaseApi {
  async getGames() {
    const snapshots = await gamesCol.get()
    return snapshots.docs.map(
      (sn) => ({ id: sn.id, ...sn.data() } as ChessGame)
    )
  }
  async getGame(id: string) {
    const ret = await gamesCol.doc(id).get()
    const board = { id: ret.id, ...ret.data() }
    return board as ChessGame
  }
  async getPgn(id: string) {
    const ret = await pgnCol.doc(id).get()
    return ret.data().pgn as string
  }
  async createGame() {
    const chess = new Chess()
    const game: Partial<ChessGame> = {
      fen: chess.fen(),
      started: Timestamp.now(),
      lastMove: Timestamp.now(),
    }
    const res = await gamesCol.add(game)
    await pgnCol.doc(res.id).set({ pgn: chess.pgn() })
    return res.id
  }
  async setGame(id: string, fen: string) {
    const game = await this.getGame(id)
    const newGame = { ...game, lastMove: Timestamp.now(), fen: fen }
    delete newGame['id']
    await gamesCol.doc(id).update(newGame)
  }
  async setPgn(id: string, pgn: string) {
    await pgnCol.doc(id).update({ pgn })
  }
}

export const proj4FirebaseApi = new Proj4FirebaseApi()
