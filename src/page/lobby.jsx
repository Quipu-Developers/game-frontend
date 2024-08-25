import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLobbyActions } from "../service/lobby_service";
import { useSocket } from "../socket";
import "../style/lobby.css";

export default function Lobby() {
  const { fetchRooms, createRoom, deleteUserAccount } = useLobbyActions();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const room_list = await fetchRooms();
        setRooms(room_list);
        console.log("방 목록:", room_list);
      } catch (error) {
        console.error("방 목록을 가져오는 중 오류 발생:", error);
      }
    };

    loadRooms();

    return () => {
      if (socket) {
        socket.off("GETROOMS");
      }
    };
  }, [socket, fetchRooms]);

  // async function removeUserAccount() {
  //   try {
  //     await deleteUserAccount();
  //     console.log("계정이 삭제되었습니다.");
  //     alert("계정이 삭제되었습니다.");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("계정 삭제 중 오류 발생:", error);
  //   }
  // }

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

  const handleRoomSubmit = async (event) => {
    event.preventDefault();
    if (roomName.trim() !== "") {
      try {
        const roomId = await createRoom(roomName);
        console.log("test");
        navigate("/waiting-room", {
          state: { roomId: roomId, roomName: roomName },
        });
      } catch (error) {
        console.error("방 생성 중 오류 발생:", error);
      }
    }
  };

  const handleEnterRoom = async (roomId, roomName) => {
    navigate("/waiting-room", {
      state: { roomId: roomId, roomName: roomName },
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="lb_container">
      <div className="lb_topcontainer">
        <div className="lb_roomlist">
          {rooms.map((room, index) => (
            <div key={index} className="lb_roombox">
              <div className="lb_roombox_num">{room.users.length}/3</div>
              <div className="lb_roombox_title">{room.roomName}</div>
              <div className="lb_roombox_title">
                {room.started ? "게임 중" : "준비 중"}
              </div>

              <button
                className="lb_submit"
                onClick={() => handleEnterRoom(room.roomId, room.roomName)}
              >
                입장하기
              </button>
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
              <label>방 이름 :</label>
              <input
                className="lb_roomname"
                id="roomName"
                value={roomName}
                onChange={handleRoomNameChange}
              />
            </div>
            <button className="lb_submit" type="submit">
              방 만들기
            </button>
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
