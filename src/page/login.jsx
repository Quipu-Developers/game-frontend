import "../style/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../service/login_service";
import { createUser } from "../service/http_service";

export default function Login() {
  const { loginUser } = useAuthActions();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  // async function handleLogin() {
  //   try {
  //     console.log(userName, phoneNumber);
  //     const userId = await loginUser(userName, phoneNumber);
  //     console.log("Logged in with userId:", userId);
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Login failed:", error.message);
  //   }
  // }

  async function handleLogin() {
    try {
      console.log(userName, phoneNumber);
      const userId = await createUser(userName, phoneNumber);
      console.log("Logged in with userId:", userId);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  }

  return (
    <div className="container">
      <div className="leftcontainer">
        <h1>배틀글라운드</h1>
        <p>
          이름:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </p>
        <p>
          전화번호:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </p>
        <button onClick={handleLogin}>로그인</button>
      </div>
      <div className="rightcontainer">
        <div className="info-section">
          <h2>게임 정보</h2>
          <p>이예나배 천하제일 타자 대회입니다.</p>
          <p>팀원과 합심하여 모든 단어를 없애보세요.</p>
          <p>게임 시간은 60초 입니다.</p>
          <p>각 단어 점수 체계는 어쩌구 저쩌구 이렇게 됩니다.</p>
          <p>남은 시간이 10초 이하가 되면 경고 표시가 나옵니다.</p>
          <p>1등에게는 원용걸 친필 사인을</p>
          <p>2등에게는 전액 장학금을 드립니다.</p>
        </div>
      </div>
    </div>
  );
}
