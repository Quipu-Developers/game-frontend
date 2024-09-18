import "../style/game.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGameActions } from "../service/game_service";
import { useSocket } from "../socket";

export default function Game() {
  const { socket, user } = useSocket();
  const location = useLocation();
  const { roomId, roomName, words: initialWords, users } = location.state || {};
  const { wordInput } = useGameActions();
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    <img src={process.env.PUBLIC_URL + "/image/irumae_happy.png"} alt="profile" />
  );
  const [isTimeout, setIsTimeout] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const [hiddenWords, setHiddenWords] = useState([]);
  const [userScore, setUserScore] = useState([0, 0, 0]);
  const [myRank, setMyRank] = useState(0); // 나의 등수 상태 추가
  const [words, setWords] = useState(initialWords); // 단어장 상태로 관리
  const [gameInfo, setGameInfo] = useState({ users: [] });
  const showTimeLeftMessage = false;
  const inputRef = useRef(null);
  const [count, setCount] = useState(60);

  // 서버에서 단어 입력 및 새로운 단어장 갱신 이벤트 받는 함수
  useEffect(() => {
    if (!socket) return;

    const getWord = ({ userId, success, word, gameInfo }) => {
      setHiddenWords((prev) => [...prev, word]);
      setUserScore([gameInfo.users[0].score, gameInfo.users[1].score, gameInfo.users[2].score]);
      setGameInfo(gameInfo);

      // 내 등수 계산
      calculateMyRank(gameInfo.users);
    };

    const handleNewWords = ({ words: newWords }) => {
      setWords(newWords); // 새로운 단어장으로 업데이트
    };

    const setupSocketListeners = () => {
      socket.on("WORD", getWord);
      socket.on("ENDGAME", () => {
        navigate("/end"); // 데이터 전송 후 결과 페이지로 이동
      });
      socket.on("NEWWORDS", handleNewWords); // 새로운 단어장을 받아옴
    };

    if (socket.connected) {
      setupSocketListeners();
    } else {
      socket.connect();
      socket.once("connect", setupSocketListeners);
    }
  }, [socket, hiddenWords]);

  // 나의 등수 계산 함수
  const calculateMyRank = (users) => {
    const sortedUsers = [...users].sort((a, b) => b.score - a.score); // 점수 기준으로 정렬
    const myUser = sortedUsers.findIndex((userObj) => userObj.userId === user?.userId); // 내 userId로 내 위치 찾기
    setMyRank(myUser + 1); // 나의 등수 설정 (1등부터 시작하도록)
  };

  // 단어 제출 처리 함수
  async function handleSubmitWord(inputWord) {
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

        // 내 등수 계산
        calculateMyRank(response.gameInfo.users);
      }
    } catch (error) {
      console.error("Error submitting word:", error.message);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const trimmedInput = inputValue.trim();
      if (words.includes(trimmedInput)) {
        setSelectedImage(
          <img src={process.env.PUBLIC_URL + "/image/irumae_happy.png"} alt="profile" />
        );
        setHiddenWords((prev) => [...prev, trimmedInput]);
        setIsValid(false);

        // 서버로 단어 제출
        await handleSubmitWord(trimmedInput);
      } else {
        setSelectedImage(
          <img src={process.env.PUBLIC_URL + "/image/irumae_sad.png"} alt="profile" />
        );
        setIsValid(true);
        console.log("틀림");
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
        <div className="profile_name">{user?.userName}</div> {/* user 객체에서 userName 가져옴 */}
        <div className="profile_timer">
          <img className="timer" src={process.env.PUBLIC_URL + "/image/timer.png"} alt="timer" />
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
                  border: users[0]?.userId === user?.userId ? "2px solid #000" : "",
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
                  border: users[1]?.userId === user?.userId ? "2px solid #000" : "",
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
                  border: users[2]?.userId === user?.userId ? "2px solid #000" : "",
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
              <img src={process.env.PUBLIC_URL + "/image/alert.png"} alt="alert" />
            </div>
          )}
          {words?.map((word, index) => (
            <div key={index} className={hiddenWords.includes(word) ? "hidden-word" : ""}>
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
