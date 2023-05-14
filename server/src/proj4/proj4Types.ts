import { Firestore, Timestamp } from 'firebase-admin/firestore'

export class ChessGame {
  id: string // firebase generated
  started: Timestamp
  lastMove: Timestamp
  fen: string // FEN representation of current board state
}
