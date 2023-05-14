import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { apiServer } from "../../utils";
import { Chess } from "chess.js";

export const Proj4Page = () => {
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const [fen, setFen] = useState<string | undefined>(undefined);
  const [pgn, setPgn] = useState<string | undefined>(undefined);
  const loadData = async (_id: string) => {
    const gameResp = await fetch(`${apiServer}/proj4/games/${_id}`);
    const gameData = await gameResp.json();
    setFen(gameData.fen);

    const pgnResp = await fetch(`${apiServer}/proj4/games/${_id}/pgn`);
    const pgnData = await pgnResp.json();
    setPgn(pgnData.pgn);
  };
  const createGame = async () => {
    const res = await fetch(`${apiServer}/proj4/games`, {
      method: "POST",
    });
    if (res.ok) {
      const j = await res.json();
      setGameId(j.id);
      await loadData(j.id);
    }
  };

  const randomMove = async () => {
    if (pgn !== undefined && gameId) {
      const chess = new Chess();
      chess.loadPgn(pgn);

      const moves = chess.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      console.log(`Random move: ${move}`);

      await fetch(`${apiServer}/proj4/games/${gameId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move }),
      });
      await loadData(gameId);
    }
  };

  return (
    <div>
      <div>Cur game: {gameId}</div>
      <div>FEN: {fen}</div>
      <div>PGN: {pgn}</div>
      <div>
        <button onClick={createGame}>Create game</button>
      </div>
      <div>
        <button onClick={randomMove}>Random move</button>
      </div>
    </div>
  );
};
