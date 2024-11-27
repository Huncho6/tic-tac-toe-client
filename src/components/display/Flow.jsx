import React, { useState } from "react";
import Lobby from "./Lobby";
import { io } from "socket.io-client";
import MultiPlayerGame from "./MultiplayerGame";

const socket = io("http://localhost:45"); // Initialize socket connection

const Flow = () => {
  const [isInGame, setIsInGame] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);

  const handleGameStart = (roomId, opponent, role) => {
    setRoomId(roomId);
    setOpponent(opponent);
    setPlayerRole(role);
    setIsInGame(true);
  };

  const handleGoBack = () => {
    setIsInGame(false);
    setRoomId(null);
    setOpponent(null);
    setPlayerRole(null);
  };

  return (
    <div>
      {isInGame ? (
        <MultiPlayerGame
          socket={socket}
          playerRole={playerRole}
          roomId={roomId}
          opponent={opponent}
          onGoBack={handleGoBack}
        />
      ) : (
        <Lobby socket={socket} onGameStart={handleGameStart} />
      )}
    </div>
  );
};

export default Flow;
