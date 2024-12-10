// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import Lobby from "./Lobby";
// import MultiPlayerGame from "./MultiplayerGame";


// const Flow = () => {
//   const [socket, setSocket] = useState(null);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [roomId, setRoomId] = useState(null);
//   const [opponent, setOpponent] = useState(null);
//   const [playerRole, setPlayerRole] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:45"); // Replace with your server URL
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const handleGameStart = (roomId, opponent, role) => {
//     setRoomId(roomId);
//     setOpponent(opponent);
//     setPlayerRole(role);
//     setGameStarted(true);
//   };

//   return socket ? (
//     gameStarted ? (
//       <MultiPlayerGame
//         socket={socket}
//         playerRole={playerRole}
//         roomId={roomId}
//         onGoBack={() => setGameStarted(false)}
//       />
//     ) : (
//       <Lobby socket={socket} onGameStart={handleGameStart} />
//     )
//   ) : (
//     <div>Loading...</div>
//   );
// };

// export default Flow;