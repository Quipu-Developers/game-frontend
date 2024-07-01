import React from 'react';
import '../style/end.css';

const End = () => {
  return (
    <div className="game-result-screen">
      <div className="rocket">
      
      <img className ="rocketimage" alt="로켓" src="/image/rocket.png"/>
  
      </div>
      <div className="rocket1">
      
      <img className ="rocketimage1" alt="로켓" src="/image/rocket.png"/>
  
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
          <div className="ranking-item">
          <div className="ranking-number">name1</div>
            <div className="ranking-number">name2</div>
            <div className="ranking-number">name3</div>
            <div className="ranking-number">name4</div>
            <div className="ranking-number">name5</div>
          </div>
        </div>
     
        </div>
      </div>
      <div className="home-button">
        <button>처음으로</button>
      </div>
    </div>
  );
};

export default End;