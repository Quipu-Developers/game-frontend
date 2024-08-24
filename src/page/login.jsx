import "../style/login.css";
import React, { useState } from "react";
import { io } from "socket.io-client"; // socket.io 클라이언트 가져오기
import { loginUser } from "../service/login_service";

export default function WaitingRoom() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="lg-container">
      <div className="lg-content-area"></div>
      <div className="lg-title">
        <img className="img1" src="/image/irumae_happy.png" alt="Happy" />
        <h1>배틀글라운드</h1>
        <img className="img2" src="/image/irumae_sad.png" alt="Sad" />
      </div>
      <div className="lg-leftcontainer">
        <h2>이름</h2>
        <input />
        <h2>전화번호</h2>
        <input />
        <button>로그인</button>
        <button onClick={handleModalOpen}>회원가입</button>
      </div>
      <div className="lg-rightcontainer">
        <div className="lg-background-image"></div>
        <div className="lg-info-section">
          <h1>(중요) 게임 정보 (중요)</h1>
          <h2>✔ 타자 고수들의 눈치싸움!</h2>
          <h2>
            ✔ 게임 시간은 <strong>60초</strong> 입니다. 남은 시간이{" "}
            <strong>10초</strong> 이하가 되면 경고 표시가 나옵니다.
          </h2>
          <h2>
            ✔ 세 명의 플레이어가 1분 동안 화면에 등장하는 단어들을 빠르게
            타이핑하며 경쟁합니다. 단어를 성공적으로 입력하면{" "}
            <strong>10점</strong>을 획득하고, 그 단어는 다른 플레이어의
            화면에서도 사라집니다. 누가 먼저 입력하느냐에 따라 점수가 달라지니,
            스피드와 타이밍이 모두 중요합니다.
          </h2>
          <h2>
            ✔ 1분 동안 최대한 많은 단어를 입력해 <strong>Top 10</strong>에
            도전하세요!
          </h2>
          <h2>
            ✔ 눈치와 타이핑 실력으로 승부를 가리는 긴장감 넘치는 타자게임, 지금
            시작해보세요!
          </h2>
        </div>
      </div>

      {/* 모달창 */}
      {isModalOpen && (
        <div className="lg-modal">
          <div className="lg-modal-content">
            <h2>배틀글라운드 회원가입</h2>
            <h4>이름</h4>
            <input />
            <h4>전화번호</h4>
            <input />
            <button>가입하기</button>
            <button onClick={handleModalClose}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
