import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Update with your backend URL

function Multiplayer () {
  const [name, setName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [playerValue, setPlayerValue] = useState('');
  const [whosTurn, setWhosTurn] = useState("X's Turn");
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(''));
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    socket.on('update-game', ({ allPlayers }) => {
      const foundObject = allPlayers.find(
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );

      const newBoard = Array(9).fill('');
      if (foundObject.p1.p1move !== '') {
        newBoard[foundObject.p1.p1move] = 'X';
      }
      if (foundObject.p2.p2move !== '') {
        newBoard[foundObject.p2.p2move] = 'O';
      }
      setBoard(newBoard);

      if (foundObject.sum % 2 === 0) {
        setWhosTurn("O's Turn");
      } else {
        setWhosTurn("X's Turn");
      }
    });

    socket.on('start-game', ({ allPlayers }) => {
      const foundObject = allPlayers.find(
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );

      setRoomId(foundObject.p1.p1name === name ? foundObject.p1.p1name : foundObject.p2.p2name);
      setPlayerValue(foundObject.p1.p1name === name ? 'X' : 'O');
      setOpponentName(foundObject.p1.p1name === name ? foundObject.p2.p2name : foundObject.p1.p1name);
      setGameStarted(true);
      setLoading(false);
    });

    socket.on('invalid-move', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('update-game');
      socket.off('start-game');
      socket.off('invalid-move');
    };
  }, [name]);

  const handleFindPlayer = () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }
    socket.emit('set-username', name);
    setLoading(true);
  };

  const handleCellClick = (index) => {
    if (board[index] !== '' || !roomId) return;
    socket.emit('make-move', { roomId, index, playerRole: playerValue });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-tilt-warp">
      <h1 className="my-12 text-5xl text-green-600 stroke-black">Tic-Tac-Toe</h1>
      {!gameStarted ? (
        <>
          <div className="flex w-11/12 relative">
            <p id="userCont">You : <span id="user">{name}</span></p>
            <p className="absolute right-0" id="oppNameCont">Opponent : <span id="oppName">{opponentName}</span></p>
          </div>
          <br />
          <p id="valueCont">You are playing as <span id="value">{playerValue}</span></p>
          <br />
          <p id="whosTurn">{whosTurn}</p>
          <div>
            <p className="text-lg" id="enterName">Enter your name : </p>
            <input
              type="text"
              placeholder="Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              className="mb-5 p-2 text-lg"
            />
          </div>
          <button
            id="find"
            onClick={handleFindPlayer}
            className="text-lg text-white cursor-pointer p-2 rounded-lg w-64 bg-black"
          >
            Search for a player
          </button>
          {loading && <img id="loading" src="loading.gif" alt="Loading" className="w-8" />}
        </>
      ) : (
        <div id="bigcont">
          <div id="cont" className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => (
              <button
                key={index}
                className="text-2xl w-24 h-24 cursor-pointer m-0 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Multiplayer;