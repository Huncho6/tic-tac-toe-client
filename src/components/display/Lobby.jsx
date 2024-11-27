import React, { useEffect, useState } from "react";

const Lobby = ({ socket, onGameStart }) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const updateUsers = (userList) => {
      const otherUsers = Object.values(userList).filter((user) => user.id !== socket.id);
      setUsers(otherUsers);
    };

    socket.on("update-users", updateUsers);

    socket.on("game-invitation", ({ from, name }) => {
      const accept = window.confirm(`${name || "A player"} has invited you to play. Accept?`);
      if (accept) socket.emit("accept-invitation", { to: from });
    });

    socket.on("start-game", ({ roomId, opponent, role }) => {
      onGameStart(roomId, opponent, role);
    });

    return () => {
      socket.off("update-users", updateUsers);
      socket.off("game-invitation");
      socket.off("start-game");
    };
  }, [socket, onGameStart]);

  const handleSetUsername = () => {
    if (username.trim()) socket.emit("set-username", username);
  };

  const handleInvite = (userId) => {
    socket.emit("invite-player", { to: userId });
  };

  return (
    <div>
      <h1>Lobby</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSetUsername}>Set Username</button>

      <h2>Available Players</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name || "Unnamed Player"} <button onClick={() => handleInvite(user.id)}>Invite</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
