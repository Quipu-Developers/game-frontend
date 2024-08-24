import "../style/waitingRoom.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendMessage,
  startGame,
  kickMember,
  deleteRoom,
} from "../service/waitingRoom_service";

async function handleSendMessage() {
  const roomId = "room123";
  const message = "Hello, team!";

  try {
    await sendMessage(roomId, message);
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Failed to send message:", error.message);
  }
}

async function handleKickMember() {
  const roomId = "room123";
  const targetId = "user456";

  try {
    await kickMember(roomId, targetId);
    console.log("Member kicked successfully!");
  } catch (error) {
    console.error("Failed to kick member:", error.message);
  }
}

async function handleDeleteRoom() {
  const roomId = "room123";

  try {
    await deleteRoom(roomId);
    console.log("Room deleted successfully!");
  } catch (error) {
    console.error("Failed to delete room:", error.message);
  }
}

export default function WaitingRoom() {
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isKickVisible, setIsKickVisible] = useState(false);
  const [kickTarget, setKickTarget] = useState("");
  const [isPlayer2Kicked, setIsPlayer2Kicked] = useState(false);
  const [title, setTitle] = useState("레뒤 안하면 강퇴!");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const navigate = useNavigate();

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const [chats, setChats] = useState([
    { message: "< 김준호 님이 입장했습니다. >", type: "system-message" },
  ]);
  const [message, setMessage] = useState("");

  const startGame = () => {
    navigate("/game");
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

  const addChatMessage = (chat, type) => {
    setChats((prevChats) => [...prevChats, { message: chat, type: type }]);
  };

  const sendMessage = () => {
    if (message) {
      addChatMessage(`김준호 : ${message}`, "my-message");
      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const toggleKickModal = (target) => {
    setKickTarget(target);
    setIsKickVisible(!isKickVisible);
  };

  const handleKickMember = () => {
    if (kickTarget) {
      console.log(`${kickTarget} was kicked`);
      setIsKickVisible(false);

      if (kickTarget === "피카츄") {
        setIsPlayer2Kicked(true);
      }
    }
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
        <div className="wr_player1">
          <div className="wr_player1_top">
            <p>김준호</p>
          </div>
          <img src="/image/irumae1.png" alt="irumae1" />
          <div className="wr_player1_bot">방장</div>
        </div>
        <div className="wr_player2">
          {!isPlayer2Kicked ? (
            <>
              <div className="wr_player2_top">
                <p>피카츄</p>
                <div className="wr_x" onClick={() => toggleKickModal("피카츄")}>x</div>
              </div>
              <img src="/image/irumae2.png" alt="irumae2" />
              {isReady && <div className="wr_player2_bot">준비</div>}
            </>
          ) : (
            <div className="wr_player2_empty"></div>
          )}
        </div>
        {isKickVisible && (
          <div className="wr_kick">
            <div className="wr_kick_content">
              <p>{kickTarget} 님을 <br />강퇴하시겠습니까?</p>
              <button className="wr_kickbutton" onClick={handleKickMember}>강퇴하기</button>
              <button className="wr_cancelbutton" onClick={() => setIsKickVisible(false)}>x</button>
            </div>
          </div>
        )}
        <div className="wr_player3">
          <div className="wr_player3_top">
            <p>죠르디</p>
            <div className="wr_x">x</div>
          </div>
          <img src="/image/irumae3.png" alt="irumae3" />
          <div className="wr_player3_bot">준비</div>
        </div>
        <div className="wr_player4"></div>
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img src="/image/person.png" alt="person" />
            <div className="wr_bottom_left_num">3</div>
            <p>/3</p>
          </div>
          <div className="wr_bottom_start" onClick={startGame}>
            게임 시작
          </div>
          <div
            className={isReady ? "wr_bottom_ready_not" : "wr_bottom_ready"}
            onClick={toggleReady}
          >
            {isReady ? "준비 취소" : "게임 준비"}
          </div>
        </div>
      </div>
      <div className="wr_rightcontainer">
        <div className="wr_chatbox">
          {chats
            .slice()
            .reverse()
            .map((chat, index) => (
              <div key={index} className={`wr_chatMessage ${chat.type}`}>
                {chat.message}
              </div>
            ))}
        </div>
        <div className="wr_inputContainer">
          <input
            className="wr_input"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage} className="wr_send">
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
            화면에 쏟아지는 단어들을 노리는 <span className="highlight">1</span>분간의 치열한 격전!            
          </li>
          <li>
            놓친 단어는 <span className="highlight">라이벌</span>의 것! <span className="lowlight">스피드</span>와 <span className="lowlight">전략</span>은 모두 필수!
          </li>
          <li>
            60초 동안 당신의 <span className="lowlightt">타이핑</span> 실력과 <span className="highlightt">눈치</span> 게임의 조화로<br/><span className="highlight">🏆Top 10🏆</span>에 도전하세요!
          </li>
        </ul>
      </div>
    </div>
  );
}