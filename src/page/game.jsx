import '../style/game.css';
import gameData from '../data/game_data.jsx';
import React, { useState, useEffect } from "react";

export default function Game() {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(<img src="image/irumae_happy.png" />);
  const [isValid, setIsvalid] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (gameData.wordList.includes(inputValue)) 
      {
        setSelectedImage(<img src="image/irumae_happy.png" />);
        setIsvalid(false);
      } 
      else {
        setSelectedImage(<img src="image/irumae_sad.png" />);
        setIsvalid(true);
      }
      setInputValue('');
    }
  }

  const [count, setCount] = useState(60);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count => count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [count]);

  return (
    <div className='container'>
      <div className='leftcontainer'>
        <div className='profile'>
          {selectedImage}
        </div>
        <div className='profile_name'>
          {gameData.currentUserName}
        </div>
        <div className='profile_timer'>
          남은 시간 :&nbsp;&nbsp;{count}초
        </div>
        <div className='rankbox'>
          <div className='rankbox_title'>
            실시간 순위
          </div>
          <div className='rankbox_first'>
            <div className='rankbox_num' style={{width: '8vh', backgroundColor: 'rgb(255, 225, 225)'}}>1등</div>
            <div style={{width: '70%'}}><p>{gameData.scores[0].userName} {gameData.scores[0].score}점</p></div>
          </div>
          <div className='rankbox_second'>
            <div className='rankbox_num' style={{width: '8vh', backgroundColor: 'rgb(250, 237, 214)', marginLeft: '5%'}}>2등</div>
            <div style={{width: '65%'}}><p>{gameData.scores[1].userName} {gameData.scores[1].score}점</p></div>
          </div>
          <div className='rankbox_third'>
            <div className='rankbox_num' style={{width: '8vh', backgroundColor: 'rgb(235, 255, 235)', marginLeft: '10%'}}>3등</div>
            <div style={{width: '60%'}}><p>{gameData.scores[2].userName} {gameData.scores[2].score}점</p></div>
          </div>
        </div>
      </div>
      <div className='rightcontainer'>
        <div className='wordbox'>
          {gameData.wordList.map((word, index) => (
            <div key={index}><u className='text'>{word}</u></div>
          ))}
        </div>
        <div className='inputbox'>
          <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={{
            border: isValid? '5px solid red' : '1px solid black' 
          }}/>
        </div>
      </div>
    </div>
  );
}