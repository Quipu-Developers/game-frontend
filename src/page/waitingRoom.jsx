import "../style/waitingRoom.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWaitingRoomActions } from "../service/waitingRoom_service";
import { useSocket } from "../socket";

export default function WaitingRoom() {
  const location = useLocation();
  const { roomId, roomName, users } = location.state || {};
  const { startGame, kickMember, deleteRoom } = useWaitingRoomActions();
  const [message, setMessage] = useState("");
  const [isKickVisible, setIsKickVisible] = useState(false);
  const [kickTarget, setKickTarget] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { socket, storage } = useSocket();
  const userId = storage.getItem("userId");
  const [chats, setChats] = useState(() => {
    const storedChats = storage.getItem(`chats_${roomId}`);
    return storedChats ? JSON.parse(storedChats) : [];
  });

  const [players, setPlayers] = useState(() => {
    const storedPlayers = storage.getItem(`players_${roomId}`);
    return storedPlayers ? JSON.parse(storedPlayers) : users;
  });

  const leader = players.find((player) => player.power === "leader"); //방장 찾기

  useEffect(() => {
    if (!socket) return;

    const getJoinUser = (user) => {
      console.log("새로운 유저가 들어왔습니다:", user);
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers, user];
        storage.setItem(`players_${roomId}`, JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    };

    const getChatMessage = ({ userName, message }) => {
      console.log("새로운 메시지:", message);
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

    const getStartGame = () => {
      navigate("/game");
    };

    const setupSocketListeners = () => {
      socket.on("JOINUSER", getJoinUser);
      socket.on("CHAT", getChatMessage);
      socket.on("DELETEROOM", getDeleteRoom);
      socket.on("STARTGAME", getStartGame);
    };

    if (socket.connected) {
      setupSocketListeners();
    } else {
      socket.connect();
      socket.once("connect", setupSocketListeners);
    }

    // 컴포넌트 언마운트 시 방 삭제
    return () => {
      socket.off("JOINUSER", getJoinUser);
      socket.off("CHAT", getChatMessage);
      socket.off("DELETEROOM", getDeleteRoom);
      socket.off("STARTGAME", getStartGame);
    };
  }, [socket, roomId, storage, navigate, leader, userId]);

  const addChatMessage = (userName, chatMessage) => {
    setChats((prevChats) => {
      const updatedChats = [...prevChats, { userName, message: chatMessage }];
      storage.setItem(`chats_${roomId}`, JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  const handleSendMessage = () => {
    try {
      const chatPacket = {
        userId,
        roomId,
        message,
      };

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
      await startGame(roomId);
      console.log("game start successfully!");
      navigate("/game");
    } catch (error) {
      console.error("Failed to start game:", error.message);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(roomId);
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

  const back = () => {
    navigate("/lobby");
  };

  const handleKickMemberConfirm = () => {
    if (kickTarget) {
      console.log(`${kickTarget} was kicked`);
      setIsKickVisible(false);
    }
  };

  return (
    <div className="wr_container">
      <div className="wr_back" onClick={back} />
      <div className="wr_topcontainer">
        <div className="wr_title">{roomName}</div>
        {String(leader.userId) === userId && (
          <button onClick={handleDeleteRoom}>방 삭제하기</button>
        )}
      </div>
      <div className="wr_leftcontainer">
        {players.map((player, index) => (
          <div key={index} className="wr_player1">
            <div className="wr_player1_top">
              <p>{player.userName}</p>
              {/* <div
                className="wr_x"
                onClick={() => toggleKickModal(player.userName)}
              >
                x
              </div> */}
            </div>
            <img src={`/image/irumae${index + 1}.png`} alt="profile" />
            {player.power === "leader" && (
              <div className="wr_player1_bot">방장</div>
            )}
          </div>
        ))}

        {/* {isKickVisible && (
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
        )} */}
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img src="/image/person.png" alt="person" />
            <div className="wr_bottom_left_num">{players.length}</div>
            <p>/3</p>
          </div>
          {String(leader.userId) === userId && (
            <div className="wr_bottom_start" onClick={handleStartGame}>
              게임 시작
            </div>
          )}
          {/* {String(leader.userId) !== userId && (
            <div className="wr_bottom_ready">게임 준비</div>
          )} */}
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
