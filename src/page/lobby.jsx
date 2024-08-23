import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchRooms,
  createRoom,
  deleteUserAccount,
} from "../service/lobby_service";
import "../style/lobby.css";

async function loadRooms() {
  try {
    const rooms = await fetchRooms();
    console.log("방 목록:", rooms);
  } catch (error) {
    console.error("방 목록을 가져오는 중 오류 발생:", error);
  }
}

async function createNewRoom() {
  try {
    const roomId = await createRoom("방 이름", "비밀번호");
    console.log("새로 생성된 방 ID:", roomId);
  } catch (error) {
    console.error("방 생성 중 오류 발생:", error);
  }
}

async function removeUserAccount() {
  try {
    await deleteUserAccount();
    console.log("계정이 삭제되었습니다.");
  } catch (error) {
    console.error("계정 삭제 중 오류 발생:", error);
  }
}

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleClick = () => {
    if (!isActive) {
      setIsActive(true);
      setTimeout(() => setIsVisible(true), 500);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsActive(false), 1000);
    }
  };

  const handleRoomCreate = () => {
    setShowForm(true);
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleRoomPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoomSubmit = (event) => {
    event.preventDefault();
    if (roomName.trim() !== "" && password.trim() !== "") {
      setRooms([...rooms, { name: roomName, password: password }]);
      setRoomName("");
      setPassword("");
      setShowForm(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setPassword("");
    setError("");
    setIsPasswordFormVisible(true);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === selectedRoom.password) {
      navigate("/game");
    } else {
      setError("(비밀번호가 틀렸습니다.)");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleClosePasswordForm = () => {
    setSelectedRoom(null);
    setError("");
    setIsPasswordFormVisible(false);
  };

  return (
    <div className="lb_container">
      {(showForm || isPasswordFormVisible) && <div className="lb_overlay" />}
      <div className="lb_topcontainer">
        <div className="lb_roomlist">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="lb_roombox"
              onClick={() => handleRoomClick(room)}
            >
              <div className="lb_roombox_num">1/3</div>
              <div className="lb_roombox_title">{room.name}</div>
              <div className="lb_roombox_admin">김준호</div>
            </div>
          ))}
        </div>
        <div className="lb_botcontainer">
          <button className="lb_roomMake" onClick={handleRoomCreate}>
            방 만들기
          </button>
        </div>
      </div>

      {showForm && (
        <div className="lb_formcontainer">
          <button className="lb_closeButton" onClick={handleCloseForm}>
            X
          </button>
          <form onSubmit={handleRoomSubmit}>
            <div className="lb_inputgroup">
              <label htmlFor="roomName">방 이름 :</label>
              <input
                className="lb_roomname"
                id="roomName"
                autoComplete="off"
                value={roomName}
                onChange={handleRoomNameChange}
                required
              />
            </div>
            <div className="lb_inputgroup">
              <label htmlFor="roomPassword">비밀번호 :</label>
              <input
                className="lb_roomPassword"
                type="password"
                id="roomPassword"
                value={password}
                onChange={handleRoomPasswordChange}
                required
              />
            </div>
            <button className="lb_submit" type="submit">
              방 만들기
            </button>
          </form>
        </div>
      )}

      {selectedRoom && (
        <div className="lb_passwordContainer">
          <button className="lb_closeButton" onClick={handleClosePasswordForm}>
            X
          </button>
          <form onSubmit={handlePasswordSubmit}>
            <div className="lb_passwordInputGroup">
              <div className="lb_selectedRoomName">{selectedRoom.name}</div>
              <div className="lb_inputGroup">
                <label htmlFor="roomPassword">비밀번호 : </label>
                <input
                  className="lb_roomPassword"
                  type="password"
                  id="roomPassword"
                  value={password}
                  onChange={handleRoomPasswordChange}
                  required
                />
              </div>
            </div>
            <button className="lb_submit" type="submit">
              입장하기
            </button>
            {error && <p className="lb_error">{error}</p>}
          </form>
        </div>
      )}
      <div
        className={`lb_rule ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        &emsp;게임 규칙
      </div>
      <div className={`lb_rule_content ${isVisible ? "visible" : ""}`}>
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
