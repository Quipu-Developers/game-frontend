import "../style/login.css";
import React, { useState } from "react";

export default function Login() {

  return (
    <div className="container">
      <div className="leftcontainer">
        <h1>배틀글라운드</h1>
        <p>
          학번:
          <input></input>
        </p>
        <p>
          이름:
          <input></input>
        </p>
        <p>
          전화번호:
          <input></input>
        </p>
        <p>
          팀 이름:
          <input></input>
        </p>
        <button>로그인</button>
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
