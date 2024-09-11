import "../style/end.css";
import { useNavigate } from "react-router-dom";
import scoreData from "../data/score_data.jsx";
import React, { useState } from "react";

const End = () => {
  const [teamRankings, setTeamRankings] = useState(scoreData.teamRankings);
  const [top10GlobalRankings, setTop10GlobalRankings] = useState(
    scoreData.top10GlobalRankings
  );
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/lobby");
  };

  return (
    <div className="game-result-screen">
      <div className="rocket">
        <img className="trophyimage" alt="트로피" src="/image/trophy.png" />
      </div>
      <div className="rocket1">
        <img className="trophyimage1" alt="트로피" src="/image/trophy.png" />
      </div>
      <div className="header">
        <h1>GAME RESULT</h1>
      </div>
      <div className="content">
        <div className="wrap">
          <div className="team-ranking">
            <div className="logo">
              <h2>TEAM</h2>
              <h2>RANKING</h2>
            </div>
            <div className="ranking-item">
              {teamRankings.length > 0 ? (
                <>
                  <div className="ranking-number">
                    <img
                      className="first"
                      alt="트로피"
                      src="/image/first.png"
                    />
                    {teamRankings[0].userName}
                  </div>
                  <div className="ranking-number">
                    <img
                      className="first"
                      alt="트로피"
                      src="/image/second.png"
                    />
                    {teamRankings[1].userName}
                  </div>
                  <div className="ranking-number">
                    <img
                      className="first"
                      alt="트로피"
                      src="/image/third.png"
                    />
                    {teamRankings[2].userName}
                  </div>
                </>
              ) : (
                <div>랭킹 데이터가 없습니다.</div>
              )}
            </div>
          </div>

          <div className="overall-ranking">
            <div className="logo">
              <h2>OVERALL</h2>
              <h2>RANKING</h2>
            </div>
            <div className="ranking-item1">
              <div className="ranking-number">
                <img className="teamicon" alt="트로피" src="/image/first.png" />{" "}
                {top10GlobalRankings[0].userName}
              </div>
              <div className="ranking-number">
                <img
                  className="teamicon"
                  alt="트로피"
                  src="/image/second.png"
                />{" "}
                {top10GlobalRankings[1].userName}
              </div>
              <div className="ranking-number">
                <img className="teamicon" alt="트로피" src="/image/third.png" />{" "}
                {top10GlobalRankings[2].userName}
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[3].rank}위{" "}
                {top10GlobalRankings[3].userName}
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[4].rank}위{" "}
                {top10GlobalRankings[4].userName}
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[5].rank}위{" "}
                {top10GlobalRankings[5].userName}
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[6].rank}위{" "}
                {top10GlobalRankings[6].userName}
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[7].rank}위{" "}
                {top10GlobalRankings[7].userName}
              </div>
              <div className="ranking-number">
                <span className="username">
                  {top10GlobalRankings[8].rank}위{" "}
                  {top10GlobalRankings[8].userName}
                </span>
              </div>
              <div className="ranking-number">
                {top10GlobalRankings[9].rank}위{" "}
                {top10GlobalRankings[9].userName}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-button">
        <button onClick={handleStartClick}>
          <img className="back" alt="버튼" src="/image/back.png" />
        </button>
      </div>
    </div>
  );
};

export default End;
