import React, { useState, useEffect } from "react";
import Square from "./Square";

const MultiPlayerGame = ({ socket, playerRole, roomId, onGoBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(playerRole === "X");
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] || !isMyTurn || winner) return;

    socket.emit("make-move", { roomId, index, playerRole });
    setIsMyTurn(false);
  };

  useEffect(() => {
    socket.on("update-game", ({ board: updatedBoard, currentPlayer }) => {
      setBoard(updatedBoard);
      setIsMyTurn(currentPlayer === playerRole);
    });

    socket.on("invalid-move", ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off("update-game");
      socket.off("invalid-move");
    };
  }, [socket, playerRole]);

  useEffect(() => {
    const checkWinner = (board) => {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return board.every((cell) => cell !== null) ? "Draw" : null;
    };

    const result = checkWinner(board);
    if (result) {
      setWinner(result);
    }
  }, [board]);

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsMyTurn(playerRole === "X");
    socket.emit("restartGame", { roomId });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Player Info */}
      <p className="text-xl font-semibold mb-2">
        {`You are playing as ${playerRole}.`}
      </p>
      <p className="text-lg mb-4">
        {isMyTurn ? "Your turn" : "Waiting for opponent..."}
      </p>

      {/* Game Board */}
      <div className="w-[70vmin] h-[70vmin] flex flex-wrap gap-[2vmin] relative">
        {board.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isClickable={isMyTurn && !value && !winner}
          />
        ))}
      </div>

      {/* Restart Button */}
      <button
        onClick={restartGame}
        className="text-lg mt-6 px-4 py-3 rounded-lg bg-black text-white block"
      >
        Restart
      </button>

      {/* Winner/Draw Popup */}
      {winner && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-red-500 dark:from-gray-700 dark:to-red-600 text-6xl gap-4 z-10"
        >
          <p className="text-center text-white">
            {winner === "Draw" ? "It's a Draw! 😎" : `${winner} Wins! 🎉`}
          </p>
          <button
            onClick={restartGame}
            className={`px-6 py-2 text-lg font-semibold uppercase tracking-wider rounded ${
              isMyTurn ? "bg-gray-800 text-green-300" : "bg-black text-white"
            }`}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiPlayerGame;
