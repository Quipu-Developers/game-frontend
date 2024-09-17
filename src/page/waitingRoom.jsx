import "../style/waitingRoom.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWaitingRoomActions } from "../service/waitingRoom_service";
import { useSocket } from "../socket";

export default function WaitingRoom() {
  const location = useLocation();
  const { roomId, roomName, users } = location.state || {};
  const { startGame, leaveRoom, deleteRoom } = useWaitingRoomActions();
  const [message, setMessage] = useState("");
  const [isKickVisible, setIsKickVisible] = useState(false);
  const [kickTarget, setKickTarget] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { socket, user, storage } = useSocket();
  const [chats, setChats] = useState(() => {
    const storedChats = storage.getItem(`chats_${roomId}`);
    return storedChats ? JSON.parse(storedChats) : [];
  });

  const [players, setPlayers] = useState(() => {
    const storedPlayers = storage.getItem(`players_${roomId}`);
    return storedPlayers ? JSON.parse(storedPlayers) : users;
  });

  const leader = players.find((player) => player.power === "leader");

  useEffect(() => {
    if (!socket || !user) return;

    const getJoinUser = (newUser) => {
      setPlayers((prevPlayers) => {
        const isUserAlreadyInRoom = prevPlayers.some(
          (player) => player.userId === newUser.user.userId
        );
        if (isUserAlreadyInRoom) {
          return prevPlayers;
        }

        const updatedPlayers = [...prevPlayers, newUser.user];
        storage.setItem(`players_${roomId}`, JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    };

    const getReconnectUser = (reconnectedUser) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player) =>
          player.userId === reconnectedUser.userId ? reconnectedUser : player
        );
        storage.setItem(`players_${roomId}`, JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    };

    const getChatMessage = ({ userName, message }) => {
      setChats((prevChats) => {
        const updatedChats = [...prevChats, { userName, message }];
        storage.setItem(`chats_${roomId}`, JSON.stringify(updatedChats));
        return updatedChats;
      });
    };

    const getDeleteRoom = () => {
      alert("방이 삭제되었습니다.");
      navigate("/lobby");
    };

    const removeUser = (response) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.filter(
          (player) => player.userId !== response.user.userId
        );
        storage.setItem(`players_${roomId}`, JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    };

    const getStartGame = ({ gameInfo }) => {
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            navigate("/game", {
              state: {
                roomId: roomId,
                roomName: roomName,
                words: gameInfo.words,
                users: gameInfo.users,
              },
            });
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 2000);
    };

    const setupSocketListeners = () => {
      if (!socket.hasListeners("JOINUSER")) {
        socket.on("JOINUSER", getJoinUser);
      }
      if (!socket.hasListeners("RECONNECT")) {
        socket.on("RECONNECT", getReconnectUser);
      }
      if (!socket.hasListeners("CHAT")) {
        socket.on("CHAT", getChatMessage);
      }
      if (!socket.hasListeners("DELETEROOM")) {
        socket.on("DELETEROOM", getDeleteRoom);
      }
      if (!socket.hasListeners("LEAVEUSER")) {
        socket.on("LEAVEUSER", removeUser);
      }
      if (!socket.hasListeners("STARTGAME")) {
        socket.on("STARTGAME", getStartGame);
      }
    };

    if (socket.connected) {
      setupSocketListeners();
    } else {
      socket.connect();
      socket.once("connect", setupSocketListeners);
    }

    return () => {
      socket.off("JOINUSER", getJoinUser);
      socket.off("RECONNECT", getReconnectUser);
      socket.off("CHAT", getChatMessage);
      socket.off("DELETEROOM", getDeleteRoom);
      socket.off("LEAVEUSER", removeUser);
      socket.off("STARTGAME", getStartGame);
    };
  }, [socket, roomId, storage, navigate, leader, user]);

  const addChatMessage = (userName, chatMessage) => {
    setChats((prevChats) => {
      const updatedChats = [...prevChats, { userName, message: chatMessage }];
      storage.setItem(`chats_${roomId}`, JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  const handleSendMessage = () => {
    try {
      const chatPacket = { message };

      addChatMessage("나", message);

      socket.emit("CHAT", chatPacket, (response) => {
        if (!response.success) {
          console.error("Failed to send message.");
        }
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error.message);
    }
  };

  const handleStartGame = async () => {
    try {
      const gameInfo = await startGame();
      socket.emit("STARTGAME", { gameInfo }, (response) => {
        if (!response.success) {
          console.error("Failed to start game.");
        }
      });
    } catch (error) {
      console.error("Failed to start game:", error.message);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom();
      alert("방이 삭제되었습니다.");
      navigate("/lobby");
    } catch (error) {
      console.error("Failed to delete room", error.message);
    }
  };

  const handleClick = () => {
    if (!isActive) {
      setIsActive(true);
      setTimeout(() => setIsVisible(true), 500);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsActive(false), 1000);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleKickModal = (target) => {
    setKickTarget(target);
    setIsKickVisible(!isKickVisible);
  };

  const handleBack = async () => {
    try {
      await leaveRoom();
      alert("로비로 이동합니다.");
      navigate("/lobby");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleKickMemberConfirm = () => {
    if (kickTarget) {
      console.log(`${kickTarget} was kicked`);
      setIsKickVisible(false);
    }
  };

  return (
    <div className="wr_container">
      {String(leader?.userId) !== String(user?.userId) && (
        <div className="wr_back" onClick={handleBack} />
      )}
      {String(leader?.userId) === String(user?.userId) && (
        <button className="wr_delete" onClick={handleDeleteRoom}>
          방 삭제하기
        </button>
      )}
      <div className="wr_topcontainer">
        <div className="wr_title">{roomName}</div>
      </div>
      <div className="wr_leftcontainer">
        {players.map((player, index) => (
          <div key={index} className="wr_player1">
            <div className="wr_player1_top">
              <p>{player.userName}</p>
            </div>
            <img
              src={process.env.PUBLIC_URL + `/image/irumae${index + 1}.png`}
              alt="profile"
            />
            {player.power === "leader" && (
              <div className="wr_player1_bot">방장</div>
            )}
          </div>
        ))}
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img
              src={process.env.PUBLIC_URL + "/image/person.png"}
              alt="person"
            />
            <div className="wr_bottom_left_num">{players.length}</div>
            <p>/3</p>
          </div>
          {String(leader?.userId) === String(user?.userId) && (
            <div
              className={`wr_bottom_start ${
                players.length !== 3 ? "disabled" : ""
              }`}
              onClick={players.length === 3 ? handleStartGame : null}
              style={{
                backgroundColor: players.length === 3 ? "#28a745" : "#ccc",
                cursor: players.length === 3 ? "pointer" : "not-allowed",
              }}
            >
              {countdown > 0 ? `게임 시작 ${countdown}` : "게임 시작"}
            </div>
          )}

          {String(leader?.userId) !== String(user?.userId) && (
            <div className="wr_bottom_start_count">
              {countdown > 0 ? `게임 시작 ${countdown}` : ""}
            </div>
          )}
        </div>
      </div>
      <div className="wr_rightcontainer">
        <div className="wr_chatbox">
          {chats
            .slice()
            .reverse()
            .map((chat, index) => (
              <div key={index} className="wr_chatMessage">
                <strong>{chat.userName}:</strong> {chat.message}
              </div>
            ))}
        </div>
        <div className="wr_inputContainer">
          <input
            className="wr_input"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSendMessage} className="wr_send">
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
