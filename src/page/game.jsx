import "../style/game.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGameActions } from "../service/game_service";
import { useSocket } from "../socket";

export default function Game() {
  const { socket, user } = useSocket();
  const location = useLocation();
  const { words: initialWords, users } = location.state || {};
  const { wordInput } = useGameActions();
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    <img
      src={process.env.PUBLIC_URL + "/image/irumae_happy.png"}
      alt="profile"
    />
  );
  const [isTimeout, setIsTimeout] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const [hiddenWords, setHiddenWords] = useState([]);
  const [userScore, setUserScore] = useState([0, 0, 0]);
  const [myRank, setMyRank] = useState(0);
  const [words, setWords] = useState(initialWords);
  const [gameInfo, setGameInfo] = useState({ users: [] });
  const showTimeLeftMessage = false;
  const inputRef = useRef(null);
  const [count, setCount] = useState(60);

  useEffect(() => {
    if (!socket) return;

    // 기존 리스너 제거 후 새로 등록
    const removeAllListeners = () => {
      socket.off("WORD");
      socket.off("ENDGAME");
      socket.off("NEWWORDS");
    };

    const getWord = ({ userId, success, word, gameInfo }) => {
      setHiddenWords((prev) => [...prev, word]);
      setUserScore([
        gameInfo.users[0].score,
        gameInfo.users[1].score,
        gameInfo.users[2].score,
      ]);
      setGameInfo(gameInfo);
      calculateMyRank(gameInfo.users);
    };

    const handleNewWords = ({ words: newWords }) => {
      setWords([]);
      setWords(newWords);
      setHiddenWords([]);
    };

    const setupSocketListeners = () => {
      removeAllListeners(); // 기존 리스너 제거
      socket.on("WORD", getWord);
      socket.on("ENDGAME", () => {
        navigate("/end");
      });
      socket.on("NEWWORDS", handleNewWords);
    };

    if (socket.connected) {
      setupSocketListeners();
    } else {
      socket.connect();
      socket.once("connect", setupSocketListeners);
    }

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      removeAllListeners();
    };
  }, [socket]);

  // 나의 등수 계산 함수
  const calculateMyRank = (users) => {
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);
    const myUser = sortedUsers.findIndex(
      (userObj) => String(userObj.userId) === String(user?.userId)
    );

    setMyRank(myUser + 1);
  };

  // 단어 제출 처리 함수
  const handleSubmitWord = async (inputWord) => {
    const word = inputWord.trim();

    try {
      const response = await wordInput(word);
      if (response.success) {
        setUserScore([
          response.gameInfo.users[0].score,
          response.gameInfo.users[1].score,
          response.gameInfo.users[2].score,
        ]);

        setGameInfo(response.gameInfo);
        calculateMyRank(response.gameInfo.users);
      }
    } catch (error) {
      console.error("Error submitting word:", error.message);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedInput = inputValue.trim();
      if (words.includes(trimmedInput)) {
        setSelectedImage(
          <img
            src={process.env.PUBLIC_URL + "/image/irumae_happy.png"}
            alt="profile"
          />
        );
        setHiddenWords((prev) => [...prev, trimmedInput]);
        setIsValid(false);

        // 서버로 단어 제출
        await handleSubmitWord(trimmedInput);
      } else {
        setSelectedImage(
          <img
            src={process.env.PUBLIC_URL + "/image/irumae_sad.png"}
            alt="profile"
          />
        );
        setIsValid(true);
      }

      setTimeout(() => {
        setIsValid(false);
      }, 300);

      setInputValue("");
    }
  };

  // 화면 렌더링 시 바로 inputbox에 입력 기능
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        boxShadow: isTimeout ? "inset 0 0 3vh rgba(255, 0, 0, 1)" : "none",
      }}
    >
      {isTimeout && <div className="overlay"></div>}
      <div className="leftcontainer">
        <div className="profile">{selectedImage}</div>
        <div className="profile_name">{user?.userName}</div>
        <div className="profile_timer">
          <img
            className="timer"
            src={process.env.PUBLIC_URL + "/image/timer.png"}
            alt="timer"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{count}
        </div>
        <div className="ranking">
          <div className="ranking_number">{myRank} 등</div>
        </div>
        <div className="rankbox">
          <div className="rankbox_title">실시간 점수</div>

          <div className="rankbox_first">
            <div>
              <p
                style={{
                  border:
                    users[0]?.userId === user?.userId ? "2px solid #000" : "",
                }}
              >
                {users[0]?.userName} {userScore[0]}점
              </p>
            </div>
          </div>

          <div className="rankbox_second">
            <div>
              <p
                style={{
                  border:
                    users[1]?.userId === user?.userId ? "2px solid #000" : "",
                }}
              >
                {users[1]?.userName} {userScore[1]}점
              </p>
            </div>
          </div>

          <div className="rankbox_third">
            <div>
              <p
                style={{
                  border:
                    users[2]?.userId === user?.userId ? "2px solid #000" : "",
                }}
              >
                {users[2]?.userName} {userScore[2]}점
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rightcontainer">
        <div className="wordbox">
          {showTimeLeftMessage && (
            <div className="time-left-message">
              <img
                src={process.env.PUBLIC_URL + "/image/alert.png"}
                alt="alert"
              />
            </div>
          )}
          {words?.map((word, index) => (
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
            onKeyDown={handleKeyDown}
            className={isValid ? "invalid" : ""}
          />
        </div>
      </div>
    </div>
  );
}
