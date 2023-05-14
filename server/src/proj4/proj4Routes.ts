import { commands } from '@/admin/discordApp.js'
import { discordApi } from '@/discord/discordApi.js'
import { discordRestApi } from '@/discord/discordRestApi.js'
import { rollieId, hackWeeklyDiscord } from '@/discord/hackWeeklyDiscord.js'
import { firestoreDb } from '@/firebase.js'
import { firebaseApi } from '@/firebase/firebaseApi.js'
import { githubApi } from '@/github/githubApi.js'
import { HWApi } from '@/hwApi.js'
import { teamList } from '@/teams.js'
import { FastifyInstance } from 'fastify'
import { TeamT } from 'shared'
import { proj4FirebaseApi } from './proj4FirebaseApi.js'
import { Chess } from 'chess.js'

export default function proj4Routes(server: FastifyInstance, options, done) {
  server.get('', async (req, res) => {
    const chess = new Chess()
    chess.move(chess.moves()[2])
    chess.move(chess.moves()[2])
    chess.move(chess.moves()[2])
    chess.move(chess.moves()[2])
    chess.move(chess.moves()[2])
    console.log(chess.pgn())
    console.log('========================================================')
    console.log(JSON.stringify(chess))
  })
  server.get('/games', async (req, res) => {
    return await proj4FirebaseApi.getGames()
  })
  server.post('/games', async (req, res) => {
    const id = await proj4FirebaseApi.createGame()
    return {
      id,
    }
  })
  server.get('/games/:gameId', async (req, res) => {
    const { gameId } = req.params as any
    return await proj4FirebaseApi.getGame(gameId)
  })
  server.get('/games/:gameId/pgn', async (req, res) => {
    const { gameId } = req.params as any
    return { pgn: await proj4FirebaseApi.getPgn(gameId) }
  })
  server.post('/games/:gameId/move', async (req, res) => {
    const { gameId } = req.params as any
    const move = req.body as any
    const pgn = await proj4FirebaseApi.getPgn(gameId)
    const chess = new Chess()
    chess.loadPgn(pgn)
    try {
      chess.move(move.move) // This throws if illegal
      await Promise.all([
        proj4FirebaseApi.setGame(gameId, chess.fen()),
        proj4FirebaseApi.setPgn(gameId, chess.pgn()),
      ])
      return { fen: chess.fen() }
    } catch (e) {
      console.log('Illegal move')
      console.log(e)
      res.code(400).send({ error: 'Illegal move' })
      return
    }
  })

  done()
}
