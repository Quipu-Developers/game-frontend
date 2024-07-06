import React from 'react';
import '../style/end.css';
import { useNavigate } from 'react-router-dom';

const End = () => {
  const navigate = useNavigate();

    const handleStartClick = () => {
      navigate('/');
    };
  return (
    <div className="game-result-screen">
      <div className="rocket">
        <img className="trophyimage" alt="트로피" src="/image/trophy.png"/>
      </div>
      <div className="rocket1">
        <img className="trophyimage1" alt="트로피" src="/image/trophy.png"/>
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
              <div className="ranking-number">name1</div>
              <div className="ranking-number">name2</div>
              <div className="ranking-number">name3</div>
            </div>
          </div>
          <div className="overall-ranking">
            <div className="logo">
              <h2>OVERALL</h2>
              <h2>RANKING</h2>
            </div>
            <div className="ranking-item1">
              <div className="ranking-number">name1</div>
              <div className="ranking-number">name2</div>
              <div className="ranking-number">name3</div>
              <div className="ranking-number">name4</div>
              <div className="ranking-number">name5</div>
              <div className="ranking-number">name6</div>
              <div className="ranking-number">name7</div>
              <div className="ranking-number">name8</div>
              <div className="ranking-number">name9</div>
              <div className="ranking-number">name10</div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-button">
      <button onClick={handleStartClick}>처음으로</button>
      </div>
    </div>
  );
};

export default End;
