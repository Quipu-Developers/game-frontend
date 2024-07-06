import '../style/game.css';
import wordlist from '../wordlist/word.js';
import React, { useState, useEffect } from "react";

export default function Game() {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(<img src="image/irumae_happy.png" />);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (wordlist.includes(inputValue)) 
      {
        setSelectedImage(<img src="image/irumae_happy.png" />);
      } 
      else {
        setSelectedImage(<img src="image/irumae_sad.png" />);
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
          김준호
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
            <div style={{width: '70%'}}><p>죠르디 300점</p></div>
          </div>
          <div className='rankbox_second'>
            <div className='rankbox_num' style={{width: '8vh', backgroundColor: 'rgb(250, 237, 214)', marginLeft: '5%'}}>2등</div>
            <div style={{width: '65%'}}><p>피카츄 200점</p></div>
          </div>
          <div className='rankbox_third'>
            <div className='rankbox_num' style={{width: '8vh', backgroundColor: 'rgb(235, 255, 235)', marginLeft: '10%'}}>3등</div>
            <div style={{width: '60%'}}><p>김준호 100점</p></div>
          </div>
        </div>
      </div>
      <div className='rightcontainer'>
        <div className='wordbox'>
          {wordlist.map((word, index) => (
            <div key={index}><u className='text'>{word}</u></div>
          ))}
        </div>
        <div className='inputbox'>
          <input value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress}/>
        </div>
      </div>
    </div>
  );
}