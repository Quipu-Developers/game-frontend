import "../style/waitingRoom.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWaitingRoomActions } from "../service/waitingRoom_service";
import { useSocket } from "../socket";

export default function WaitingRoom() {
  const location = useLocation();
  const { roomId, roomName, users } = location.state || {};
  const { sendMessage, startGame, kickMember, deleteRoom } =
    useWaitingRoomActions();
  const [chats, setChats] = useState([]);
  const [players, setPlayers] = useState(
    users.map((user) => ({ ...user, isReady: false }))
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { socket, storage } = useSocket();
  const userId = storage.getItem("userId");
  console.log(users, userId);
  const [isKickVisible, setIsKickVisible] = useState(false);
  const [kickTarget, setKickTarget] = useState("");
  const [isPlayer2Kicked, setIsPlayer2Kicked] = useState(false);
  const [title, setTitle] = useState("레뒤 안하면 강퇴!");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
        setPlayers((prevPlayers) => [
          ...prevPlayers,
          { ...user, isReady: false },
        ]);
      };

      socket.on("CHAT", handleChat);
      socket.on("JOINUSER", handleJoinUser);

      return () => {
        socket.off("CHAT", handleChat);
        socket.off("JOINUSER", handleJoinUser);
      };
    }
  }, [socket]);

  async function handleSendMessage() {
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

  const handleKickMemberConfirm = () => {
    if (kickTarget) {
      console.log(`${kickTarget} was kicked`);
      setIsKickVisible(false);

      if (kickTarget === "피카츄") {
        setIsPlayer2Kicked(true);
      }
    }
  };

  async function handleDeleteRoom() {
    try {
      await deleteRoom(roomId);
      console.log("Room deleted successfully!");
    } catch (error) {
      console.error("Failed to delete room:", error.message);
    }
  }

  const toggleReady = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.userId === userId
          ? { ...player, isReady: !player.isReady }
          : player
      )
    );
    console.log("players :", players);
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    }
  };

  const back = () => {
    navigate("/lobby");
  };

  return (
    <div className="wr_container">
      <div className="wr_back" onClick={back} />
      <div className="wr_topcontainer">
        <div className="wr_title">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyPress={handleTitleKeyPress}
              autoFocus
            />
          ) : (
            <span onClick={handleTitleEdit}>{title}</span>
          )}
        </div>
      </div>
      <div className="wr_leftcontainer">
        {players.map((player, index) => (
          <div key={index} className="wr_player1">
            <div className="wr_player1_top">
              <p>{player.userName}</p>
              <div
                className="wr_x"
                onClick={() => toggleKickModal(player.userName)}
              >
                x
              </div>
            </div>
            <img src={`/image/irumae${index + 1}.png`} alt="profile" />
            {player.power === "leader" && (
              <div className="wr_player1_bot">방장</div>
            )}
            {player.isReady && player.userId === userId && (
              <div className="wr_player2_bot">준비</div>
            )}
          </div>
        ))}
        {isKickVisible && (
          <div className="wr_kick">
            <div className="wr_kick_content">
              <p>
                {kickTarget} 님을 <br />
                강퇴하시겠습니까?
              </p>
              <button
                className="wr_kickbutton"
                onClick={handleKickMemberConfirm}
              >
                강퇴하기
              </button>
              <button
                className="wr_cancelbutton"
                onClick={() => setIsKickVisible(false)}
              >
                x
              </button>
            </div>
          </div>
        )}
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img src="/image/person.png" alt="person" />
            <div className="wr_bottom_left_num">{players.length}</div>
            <p>/3</p>
          </div>
          <div className="wr_bottom_start" onClick={handleStartGame}>
            게임 시작
          </div>
          <div
            className={
              players.find((player) => player.userId === userId)?.isReady
                ? "wr_bottom_ready_not"
                : "wr_bottom_ready"
            }
            onClick={toggleReady}
          >
            {players.find((player) => player.userId === userId)?.isReady
              ? "준비 취소"
              : "게임 준비"}
          </div>
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
          <button onClick={handleSendMessage} className="wr_send">
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
        <h3>🌟타자왕들의 한 판 승부!🌟</h3>
        <ul>
          <li>
            화면에 쏟아지는 단어들을 노리는 <span className="highlight">1</span>
            분간의 치열한 격전!
          </li>
          <li>
            놓친 단어는 <span className="highlight">라이벌</span>의 것!{" "}
            <span className="lowlight">스피드</span>와{" "}
            <span className="lowlight">전략</span>은 모두 필수!
          </li>
          <li>
            60초 동안 당신의 <span className="lowlightt">타이핑</span> 실력과{" "}
            <span className="highlightt">눈치</span> 게임의 조화로
            <br />
            <span className="highlight">🏆Top 10🏆</span>에 도전하세요!
          </li>
        </ul>
      </div>
    </div>
  );
}
