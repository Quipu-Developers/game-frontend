import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/start.css";

export default function Start() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [studentId, setStudentId] = useState(0);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [numUsers, setNumUsers] = useState(0);

  return (
    <div className="start-container">
      <h1>배틀글라운드</h1>
      <div className="start-subcontainer">
        <div className="window left">
          <div className="window-bar">
            <p>● ● ●</p>
          </div>
          <div className="window-left">
            <div className="input-box">
              <div style={{ width: "30%" }}>
                <p>학번</p>
              </div>
              <input
                style={{ width: "65%" }}
                onChange={(e) => setStudentId(e.target.value)}
              ></input>
            </div>
            <div className="input-box">
              <div style={{ width: "45%" }}>
                <p>이름</p>
              </div>
              <input
                style={{ width: "50%" }}
                onChange={(e) => setUserName(e.target.value)}
              ></input>
            </div>
            <div className="promo-text">
              <p>누구보다 빠르고 정확하게</p>
            </div>
            <div className="input-box">
              <input
                style={{ width: "70%" }}
                onChange={(e) => setPhoneNumber(e.target.value)}
              ></input>
              <div style={{ width: "25%" }}>
                <p>전화번호</p>
              </div>
            </div>
            <div className="promo-text">
              <p>UOS 최고의 타이핑 마스터에 도전하세요!</p>
            </div>
            <div className="input-box">
              <div style={{ width: "30%" }}>
                <p>팀 이름</p>
              </div>
              <input
                style={{ width: "65%" }}
                onChange={(e) => setTeamName(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
        <div className="window middle">
          <div className="window-bar">
            <p>● ● ●</p>
          </div>
          <div className="window-middle">
            <h3>개인전이고 🌟</h3>
            <ul>
              <li>
                ✔️ 화면에 보이는 단어를 팀원보다{" "}
                <span className="highlight">먼저 입력</span>하여 낚아채세요!
              </li>
              <li>
                ✔️ <span className="highlight">최대한 많은 단어</span>를
                입력하여 팀 내 1등에 도전하세요 💪
              </li>
            </ul>
            <h3>팀전이기도 한 🏆</h3>
            <ul>
              <li>
                ✔️ 모든 단어를 없앤 <span className="highlight">남은 시간</span>
                대로 팀 순위가 결정됩니다! 최고의 팀을 구성하세요😘
              </li>
              <li>
                ✔️ 시간 내에 모든 단어를 제거하지 못하면{" "}
                <span className="highlight">팀 전체 탈락</span>합니다! ⚠️
              </li>
            </ul>
          </div>
        </div>
        <div className="window right">
          <div className="window-bar">
            <p>● ● ●</p>
          </div>
          <div className="window-right">
            <div>
              <p>김준호님이 입장하셨습니다.</p>
            </div>
            <div style={{ justifyContent: "end" }}>
              <p style={{ borderRadius: "15px 15px 0 15px" }}>
                정지훈님이 입장하셨습니다.
              </p>
            </div>
            <div>
              <p>송승준님이 입장하셨습니다.</p>
            </div>
            <h3>
              <span>5초</span> 후 게임이 시작됩니다.
            </h3>
          </div>
        </div>
      </div>
      <div className="start-button-container">
        <label>GAME START</label>
        <div></div>
      </div>
    </div>
  );
}
