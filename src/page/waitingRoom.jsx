import "../style/waitingRoom.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWaitingRoomActions } from "../service/waitingRoom_service";
import { useSocket } from "../socket";

export default function WaitingRoom() {
  const location = useLocation();
  const { roomId, roomName, users } = location.state || {};
  console.log(roomId, roomName, users);
  const { sendMessage, startGame, kickMember, deleteRoom } =
    useWaitingRoomActions();
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chats, setChats] = useState([]);
  const [players, setPlayers] = useState(users);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { socket } = useSocket();

  const addChatMessage = (userId, chatMessage) => {
    setChats((prevChats) => [...prevChats, { userId, message: chatMessage }]);
  };

  useEffect(() => {
    if (socket) {
      const handleChat = ({ userId, message }) => {
        addChatMessage(userId, message);
      };

      const handleJoinUser = ({ user }) => {
        console.log(user);
        setPlayers((prevPlayers) => [...prevPlayers, user]);
      };

      socket.on("CHAT", handleChat);
      socket.on("JOINUSER", handleJoinUser);

      return () => {
        socket.off("CHAT", handleChat);
        socket.off("JOINUSER", handleJoinUser);
      };
    }
  }, [socket]);

  async function handleSendMessage(message) {
    try {
      await sendMessage(roomId, message);
      console.log("Message sent successfully!");
      addChatMessage("나", message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error.message);
    }
  }

  async function handleStartGame() {
    try {
      await startGame(roomId);
      console.log("game start successfully!");
      navigate("/game");
    } catch (error) {
      console.error("Failed to game start:", error.message);
    }
  }

  async function handleKickMember(targetId) {
    try {
      await kickMember(roomId, targetId);
      console.log("Member kicked successfully!");
    } catch (error) {
      console.error("Failed to kick member:", error.message);
    }
  }

  async function handleDeleteRoom() {
    try {
      await deleteRoom(roomId);
      console.log("Room deleted successfully!");
    } catch (error) {
      console.error("Failed to delete room:", error.message);
    }
  }

  const toggleReady = () => {
    setIsReady(!isReady);
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
      const roomId = "example-room-id";
      handleSendMessage(roomId, message);
    }
  };

  return (
    <div className="wr_container">
      <div className="wr_leftcontainer">
        {players.map((player, index) => (
          <div key={index} className="wr_player1">
            <div className="wr_player1_top">
              <p>{player.userName}</p>
            </div>
            <img src={`/image/irumae${index + 1}.png`} alt="profile" />
            {player.power === "leader" && (
              <div className="wr_player1_bot">방장</div>
            )}
            {isReady && <div className="wr_player2_bot">준비</div>}
          </div>
        ))}
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img src="/image/person.png" alt="person" />
            <div className="wr_bottom_left_num">{players.length}</div>
            <p>/3</p>
          </div>
          {/* <div className="wr_bottom_start" onClick={startGame}/> */}
          <div className="wr_bottom_ready" onClick={toggleReady} />
        </div>
      </div>
      <div className="wr_rightcontainer">
        <div className="wr_chatbox">
          {chats
            .slice()
            .reverse()
            .map((chat, index) => (
              <div key={index} className="wr_chatMessage">
                <strong>{chat.userId}:</strong> {chat.message}
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
          <button
            onClick={() => handleSendMessage("example-room-id", message)}
            className="wr_send"
          >
            전송
          </button>
        </div>
      </div>
      <div
        className={`wr_rule ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        &emsp;게임 규칙
      </div>
      <div className={`wr_rule_content ${isVisible ? "visible" : ""}`}>
        <h3>개인전이고 🌟</h3>
        <ul>
          <li>
            ✔️ 화면에 보이는 단어를 팀원보다{" "}
            <span className="highlight">먼저 입력</span>하여 낚아채세요!
          </li>
          <li>
            ✔️ <span className="highlight">최대한 많은 단어</span>를 입력하여 팀
            내 1등에 도전하세요 💪
          </li>
        </ul>
        <h3>팀전이기도 한 🏆</h3>
        <ul>
          <li>
            ✔️ 모든 단어를 없앤 <span className="highlight">남은 시간</span>대로
            팀 순위가 결정됩니다! 최고의 팀을 구성하세요😘
          </li>
          <li>
            ✔️ 시간 내에 모든 단어를 제거하지 못하면{" "}
            <span className="highlight">팀 전체 탈락</span>합니다! ⚠️
          </li>
        </ul>
      </div>
    </div>
  );
}
