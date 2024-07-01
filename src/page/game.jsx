import '../style/game.css';
import wordlist from '../wordlist/word.js';
import React, { useState, useEffect } from "react";

export default function Game() {

  const [count, setCount] = useState(60);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count => count - 1); 
    }, 1000);
    if(count === 0){
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [count]);

  return (
    <div className='container'>

      <div className='topcontainer'>
        <div className='logo'>
          Quipu&nbsp;
        </div>
        <div className='title'>
          배틀글라운드
        </div>
        <div className='timer'>
          제한시간 :&nbsp;&nbsp;{count}초
        </div>
      </div>
      
      <div className='leftcontainer'>
        <div className='rankbox'>
          <div className='rankbox_first'>죠르디 300점</div>
          <div className='rankbox_second'>피카츄 200점</div>
          <div className='rankbox_third'>김준호 100점</div>
        </div>
      </div>

      <div className='centercontainer'>
        <div className='wordbox'>
          {wordlist.map((word, index) => (
            <div key={index}><u className='text'>{word}</u></div>
          ))}
        </div>
        <div className='inputbox'>
          <input></input>
        </div>
      </div>

      <div className='rightcontainer'>
        <div className='profile'>
          <h4 className='profile_name'>김준호</h4>
          <img src={process.env.PUBLIC_URL + "./image/irumae.png"}/>
        </div>
        <div className='ranking'>
          <h4 className='ranking_title'>현재 순위</h4>
          <h4 className='ranking_number'>3</h4>
        </div>
      </div>
    </div>
  );
}