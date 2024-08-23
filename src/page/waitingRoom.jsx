import "../style/waitingRoom.css"
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function WaitingRoom() {
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const [chats, setChats] = useState([
    { message: "< 김준호 님이 입장했습니다. >", type: "system-message" }
  ]);
  const [message, setMessage] = useState('');

  const startGame = () => {
    navigate('/game');
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
      setMessage('');
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="wr_container">
      <div className="wr_leftcontainer">
        <div className="wr_player1">
          <div className="wr_player1_top"><p>김준호</p></div>
          <img src="/image/irumae1.png" alt="irumae1" />
          <div className="wr_player1_bot">방장</div>
        </div>
        <div className="wr_player2">
          <div className="wr_player2_top"><p>피카츄</p></div>
          <img src="/image/irumae2.png" alt="irumae2" />
          {isReady && <div className="wr_player2_bot">준비</div>}
        </div>
        <div className="wr_player3">
          <div className="wr_player3_top"><p>죠르디</p></div>
          <img src="/image/irumae3.png" alt="irumae3" />
          <div className="wr_player3_bot">준비</div>
        </div>
        <div className="wr_player4"></div>
        <div className="wr_bottom">
          <div className="wr_bottom_left">
            <img src="/image/person.png" alt="person" />
            <div className="wr_bottom_left_num">3</div><p>/3</p>
          </div>
          {/* <div className="wr_bottom_start" onClick={startGame}/> */}
          <div className="wr_bottom_ready" onClick={toggleReady}/>
        </div>
      </div>
      <div className="wr_rightcontainer">
        <div className="wr_chatbox">
        {chats.slice().reverse().map((chat, index) => (
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
          <button
            onClick={sendMessage}
            className="wr_send">전송</button>
        </div>
      </div>
      <div
        className={`wr_rule ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        &emsp;게임 규칙
      </div>
      <div className={`wr_rule_content ${isVisible ? 'visible' : ''}`}>
        <h3>개인전이고 🌟</h3>
        <ul>
          <li>✔️ 화면에 보이는 단어를 팀원보다 <span className="highlight">먼저 입력</span>하여 낚아채세요!</li>
          <li>✔️ <span className="highlight">최대한 많은 단어</span>를 입력하여 팀 내 1등에 도전하세요 💪</li>
        </ul>
        <h3>팀전이기도 한 🏆</h3>
        <ul>
          <li>✔️ 모든 단어를 없앤 <span className="highlight">남은 시간</span>대로 팀 순위가 결정됩니다! 최고의 팀을 구성하세요😘</li>
          <li>✔️ 시간 내에 모든 단어를 제거하지 못하면 <span className="highlight">팀 전체 탈락</span>합니다! ⚠️</li>
        </ul>
      </div>
    </div>
  )
}
