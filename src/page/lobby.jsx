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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

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

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    navigate('/');
    removeUserAccount();
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleShowRules = () => {
    setShowRulesModal(true);
  };

  const handleCloseRules = () => {
    setShowRulesModal(false);
  };

  return (
    <div className="lb_container">
      <div className="lb_sidebar">
        <div className="lb_sidebar_top">
          <div className="lb_sidebar_profile">
            <img src="/image/irumaelb.png" alt="irumaelb" />
          </div>
          <div className="lb_sidebar_nn">
            <div className="lb_sidebar_name">
              김준호
            </div>
            <div className="lb_sidebar_num">
              010-1234-5678
            </div>
          </div>
          <div className="lb_sidebar_delete">
            <div
              className={`lb_rule ${isActive ? "active" : ""}`}
              onClick={handleShowRules}>
              게임 규칙
            </div>
            <button className="lb_sidebar_delete_button" onClick={handleDeleteClick}>
              탈퇴하기
            </button>
          </div>
        </div>
        <div className="lb_sidebar_bottom">
          <div className="lb_sidebar_list">접속자 목록</div>
          <div className="lb_sidebar_list_name">
            <li>김준호</li>
            <li>죠르디</li>
            <li>피카츄</li>
            <li>송승준</li>
            <li>이예나</li>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="lb_confirm_overlay">
          <div className="lb_confirm_dialog">
            <p>정말 탈퇴하시겠습니까?</p>
            <div className="lb_confirm_buttons">
              <button onClick={handleConfirmDelete}>확인</button>
              <button onClick={handleCancelDelete}>취소</button>
            </div>
          </div>
        </div>
      )}

      {(showForm || isPasswordFormVisible) && <div className="lb_overlay" />}

      <div className="lb_titlecontainer">
        배틀글라운드
      </div>
      <div className="lb_topcontainer">
        {rooms.length === 0 ? (
          <div className="lb_no_rooms_message">
            (&ensp; 방이 하나도 없어요 . . . 😢😢&ensp;)
          </div>
        ) : (
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
        )}
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

      {showRulesModal && (
        <div className="lb_rules_modal">
          <div className="lb_rule_content">
            <button className="lb_closeButton" onClick={handleCloseRules}>
              X
            </button>
            <h3>게임 규칙</h3>
            <ul>
              <li>
                화면에 쏟아지는 단어들을 노리는 <span className="highlight">1</span>분간의 치열한 격전!
              </li>
              <li>
                놓친 단어는 <span className="highlight">라이벌</span>의 것! <span className="lowlight">스피드</span>와 <span className="lowlight">전략</span>은 모두 필수!
              </li>
              <li>
                60초 동안 당신의 <span className="lowlightt">타이핑</span> 실력과 <span className="highlightt">눈치</span> 게임의 조화로<br /><span className="highlight">🏆Top 10🏆</span>에 도전하세요!
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
