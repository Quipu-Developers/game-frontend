import "../style/end.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getGameEndInfo } from "../service/http_service";
import { useSocket } from "../socket";

const End = () => {
  const { socket, storage } = useSocket();
  const [gameEndInfo, setGameEndInfo] = useState(null); // 초기 상태는 null로 설정
  const userId = storage.getItem("userId");
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchGameEndInfo = async () => {
      try {
        const fetchedGameEndInfo = await getGameEndInfo(userId); // 비동기 데이터 가져오기
        console.log(fetchedGameEndInfo);
        setGameEndInfo(fetchedGameEndInfo); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching game end info:", error);
      }
    };

    fetchGameEndInfo(); // 데이터 가져오는 함수 호출
  }, [userId]);

  // 데이터를 받아오기 전에는 로딩 상태를 표시
  if (!gameEndInfo) {
    return <div>Loading...</div>;
  }

  const { personalRank, top10 } = gameEndInfo;

  return (
    <div className="game-result-screen">
      <div className="rocket">
        <img
          className="trophyimage"
          alt="트로피"
          src={process.env.PUBLIC_URL + "/image/trophy.png"}
        />
      </div>
      <div className="rocket1">
        <img
          className="trophyimage1"
          alt="트로피"
          src={process.env.PUBLIC_URL + "/image/trophy.png"}
        />
      </div>
      <div className="header">
        <h1>GAME RESULT</h1>
      </div>

      <div className="content">
        <div className="wrap">
          <div className="team-ranking">
            <div className="logo">
              <h2>MY</h2>
              <h2>RANK</h2>
            </div>
            <div className="ranking-item">
              <div className="ranking-number">
                {personalRank.rank}위 {personalRank.userName}{" "}
                {personalRank.score}
              </div>
            </div>
          </div>

          <div className="overall-ranking">
            <div className="logo">
              <h2>OVERALL</h2>
              <h2>RANKING</h2>
            </div>
            <div className="ranking-item1">
              {top10.map((player, index) => (
                <div key={player.userId} className="ranking-number">
                  <img
                    className="teamicon"
                    alt={
                      index === 0
                        ? "1st"
                        : index === 1
                        ? "2nd"
                        : index === 2
                        ? "3rd"
                        : "Rank"
                    }
                    src={
                      process.env.PUBLIC_URL +
                      `/image/${
                        index === 0
                          ? "first"
                          : index === 1
                          ? "second"
                          : index === 2
                          ? "third"
                          : ""
                      }.png`
                    }
                  />
                  {index + 1}위 {player.userName} {player.score}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="home-button">
        <button onClick={handleStartClick}>
          <img
            className="back"
            alt="버튼"
            src={process.env.PUBLIC_URL + "/image/back.png"}
          />
        </button>
      </div>
    </div>
  );
};

export default End;
