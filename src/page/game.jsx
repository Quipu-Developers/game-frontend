import "../style/game.css";
import gameData from "../data/game_data.jsx";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const [inputValue, setInputValue] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [selectedImage, setSelectedImage] = useState(<img src="image/irumae_happy.png" />);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const [hiddenWords, setHiddenWords] = useState([]);
  const [showTimeLeftMessage, setShowTimeLeftMessage] = useState(false);
  const [shuffleWordList, setShuffleWordList] = useState(gameData.wordList);
  const inputRef = useRef(null);

  //단어장 무작위 셔플
  useEffect(() => {
    const shuffledList = [...gameData.wordList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    setShuffleWordList(shuffledList);
  }, [gameData.wordList]);

  //화면 렌더링 시 바로 inputbox에 입력 기능
  useEffect(() => {
    setInputFocus(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const trimmedInput = inputValue.trim();
      if (shuffleWordList.includes(trimmedInput)) 
      {
        setSelectedImage(<img src="image/irumae_happy.png" />);
        setHiddenWords([...hiddenWords, trimmedInput]);
        setIsValid(false);
      } 
      else {
        setSelectedImage(<img src="image/irumae_sad.png" />);
        setIsValid(true);
      }
      setInputValue("");
    }
  };

  const [count, setCount] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => count - 1);
      if (count <= 11 && count > 0) {
        setIsTimeout(true);
        setTimeout(() => {
          setIsTimeout(false);
        }, 200);
      }
    }, 1000);
    if (count === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [count]);

  return (
    <div
      className="container"
      style={{
        boxShadow: isTimeout ? "inset 0 0 1.5vh rgba(255, 0, 0, 1)" : "none",
      }}
    >
      {isTimeout && <div className="overlay"></div>}
      <div className="leftcontainer">
        <div className="profile">{selectedImage}</div>
        <div className="profile_name">{gameData.currentUserName}</div>
        <div className="profile_timer">
          <img className="timer" src="/image/timer.png" alt='timer'/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{count}
        </div>
        <div className="ranking">
          <div className="ranking_number">3</div>
        </div>
        <div className="rankbox">
          <div className="rankbox_title">실시간 순위</div>
          <div className="rankbox_first">
            <div className="rankbox_num">1</div>
            <div style={{ width: "70%" }}>
              <p>
                {gameData.scores[0].userName} {gameData.scores[0].score}점
              </p>
            </div>
          </div>
          <div className="rankbox_second">
            <div className="rankbox_num">2</div>
            <div style={{ width: "70%" }}>
              <p>
                {gameData.scores[1].userName} {gameData.scores[1].score}점
              </p>
            </div>
          </div>
          <div className="rankbox_third">
            <div className="rankbox_num">3</div>
            <div style={{ width: "70%" }}>
              <p>
                {gameData.scores[2].userName} {gameData.scores[2].score}점
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="rightcontainer">
        <div className="wordbox">
          {showTimeLeftMessage && (
            <div className="time-left-message">
              <img src="/image/alert.png" alt='alert'/>
            </div>
          )}
          {shuffleWordList.map((word, index) => (
            <div
              key={index}
              className={hiddenWords.includes(word) ? "hidden-word" : ""}
            >
              <u className="text">{word}</u>
            </div>
          ))}
        </div>
        <div className="inputbox">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={isValid ? "invalid" : ""}
          />
        </div>
      </div>
    </div>
  );
}
