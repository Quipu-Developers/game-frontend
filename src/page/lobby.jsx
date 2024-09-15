import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLobbyActions } from "../service/lobby_service";
import { useSocket } from "../socket";
import "../style/lobby.css";

export default function Lobby() {
  const { fetchRooms, createRoom, enterRoom, deleteUserAccount, leaveRoom } =
    useLobbyActions();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const navigate = useNavigate();
  const { socket, storage } = useSocket();
  const userName = storage.getItem("userName");
  const phoneNumber = storage.getItem("phoneNumber");
  const [users, setUsers] = useState([]);

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

    socket.on("CREATEROOM", async () => {
      await loadRooms();
    });

    socket.on("DELETEROOM", async () => {
      await loadRooms();
    });

    socket.on("JOINUSER", async () => {
      await loadRooms();
    });

    socket.on("LEAVEUSER", async () => {
      await loadRooms();
    });

    return () => {
      if (socket) {
        socket.off("CREATEROOM");
        socket.off("DELETEROOM");
        socket.off("JOINUSER");
        socket.off("LEAVEUSER");
      }
    };
  }, [socket, fetchRooms]);

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
        const room = await createRoom(roomName);
        navigate("/waiting-room", {
          state: {
            roomId: room.roomId,
            roomName: room.roomName,
            users: room.users,
          },
        });
      } catch (error) {
        console.error("방 생성 중 오류 발생:", error);
      }
    }
  };

  const handleEnterRoom = async (roomId, roomName) => {
    try {
      const users = await enterRoom(roomId);
      navigate("/waiting-room", {
        state: {
          roomId: roomId,
          roomName: roomName,
          userName: userName,
          phoneNumber: phoneNumber,
          users: users,
        },
      });
    } catch (error) {
      console.error("방 입장 중 오류 발생:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    navigate("/");
    deleteUserAccount();
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
            <div className="lb_sidebar_name">{userName}</div>
            <div className="lb_sidebar_num">{phoneNumber}</div>
          </div>
          <div className="lb_sidebar_delete">
            <div
              className={`lb_rule ${isActive ? "active" : ""}`}
              onClick={handleShowRules}
            >
              게임 규칙
            </div>
            <button
              className="lb_sidebar_delete_button"
              onClick={handleDeleteClick}
            >
              탈퇴하기
            </button>
          </div>
        </div>
        {/* <div className="lb_sidebar_bottom">
          <div className="lb_sidebar_list">접속자 목록</div>
          <ul className="lb_sidebar_list_name">
            {users.map((user) => (
              <li key={user.userId}>{user.userName}</li>
            ))}
          </ul>
        </div> */}
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

      <div className="lb_titlecontainer">배틀글라운드</div>
      <div className="lb_topcontainer">
        {rooms.length === 0 ? (
          <div className="lb_no_rooms_message">
            (&ensp; 방이 하나도 없어요 . . . 😢😢&ensp;)
          </div>
        ) : (
          <div className="lb_roomlist">
            {rooms.map((room, index) => (
              <div key={index} className="lb_roombox">
                <div className="lb_roombox_num">{room.users.length}/3</div>
                <div className="lb_roombox_title">{room.roomName}</div>
                <div className="lb_roombox_title">
                  {room.started ? "게임 중" : "준비 중"}
                </div>
                <div className="lb_roombox_admin">
                  {room.users.find((user) => user.power === "leader")?.userName}
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

      {showRulesModal && (
        <div className="lb_rules_modal">
          <div className="lb_rule_content">
            <button className="lb_closeButton" onClick={handleCloseRules}>
              X
            </button>
            <h3>게임 규칙</h3>
            <ul>
              <li>
                화면에 쏟아지는 단어들을 노리는{" "}
                <span className="highlight">1</span>분간의 치열한 격전!
              </li>
              <li>
                놓친 단어는 <span className="highlight">라이벌</span>의 것!{" "}
                <span className="lowlight">스피드</span>와{" "}
                <span className="lowlight">전략</span>은 모두 필수!
              </li>
              <li>
                60초 동안 당신의 <span className="lowlightt">타이핑</span>{" "}
                실력과 <span className="highlightt">눈치</span> 게임의 조화로
                <br />
                <span className="highlight">🏆Top 10🏆</span>에 도전하세요!
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
