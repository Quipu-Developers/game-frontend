import "../style/end.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getGameEndInfo } from "../service/http_service";
import { useAuthActions } from "../service/login_service";
import { useSocket } from "../socket";

const End = () => {
  const { storage } = useSocket();
  const { logoutUser } = useAuthActions();
  const [gameEndInfo, setGameEndInfo] = useState(null);
  const userId = storage.getItem("userId");
  const navigate = useNavigate();

  const handleStartClick = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
    }
  };

  useEffect(() => {
    const fetchGameEndInfo = async () => {
      try {
        const fetchedGameEndInfo = await getGameEndInfo(userId);
        setGameEndInfo(fetchedGameEndInfo);
      } catch (error) {
        console.error("Error fetching game end info:", error);
      }
    };

    fetchGameEndInfo();
  }, [userId]);

  if (!gameEndInfo) {
    return <div>Loading...</div>;
  }

  const { personalRank, top10 } = gameEndInfo;

  return (
    <div className="game-result-screen">
      <div className="header">
        <h1>배틀글라운드 게임 결과</h1>
      </div>

      <div className="content">
        <div className="wrap">
          <div className="overall-ranking">
            <div className="ranking-item1">
              {top10.map((player, index) => (
                <div
                  key={player.userId}
                  className="ranking-number"
                  style={{
                    border:
                      player.userId === Number(userId)
                        ? "2px solid #000"
                        : "none",
                    backgroundColor:
                      player.userId === Number(userId)
                        ? "#f0f0f0"
                        : "transparent",
                  }}
                >
                  <img
                    className="teamicon"
                    alt={
                      index === 0
                        ? "1st"
                        : index === 1
                        ? "2nd"
                        : index === 2
                        ? "3rd"
                        : ""
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
                  <span style={{ color: "#3b4755" }}>&nbsp;{index + 1}위</span>{" "}
                  <span style={{ color: "#3b4755" }}>{player.userName}</span>{" "}
                  <span
                    style={{
                      color: "white",
                      WebkitTextStroke: "1.5px #11324d",
                    }}
                  >
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
            <div className="ranking-item2">
              {/* top10에 자신이 포함되지 않은 경우에만 자신의 순위를 추가로 렌더링 */}
              <div></div>
              {!top10.some((player) => player.userId === Number(userId)) && (
                <div
                  className="ranking-number"
                  style={{ border: "2px solid #000" }}
                >
                  <span style={{ color: "#3b4755" }}>
                    &nbsp;{personalRank.rank}위
                  </span>{" "}
                  <span style={{ color: "#3b4755" }}>
                    {personalRank.userName}
                  </span>{" "}
                  <span
                    style={{
                      color: "white",
                      WebkitTextStroke: "1.5px #11324d",
                    }}
                  >
                    {personalRank.score}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="home-button" onClick={handleStartClick}>
        <img
          className="back"
          alt="버튼"
          src={process.env.PUBLIC_URL + "/image/home.png"}
        />
      </div>
    </div>
  );
};

export default End;
