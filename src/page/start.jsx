import React from 'react';
import '../style/start.css'

export default function Start() {
    return (
        <div className="start-container">
            <h1>배틀글라운드</h1>
            <div className="start-subcontainer">
                <div className="start-subcontainer__bar"></div>
                <div className="left-subcontainer">
                    <div className="input-box">
                        <div className="input-label"><p>학번</p></div>
                        <input></input>
                    </div>
                    <div className="input-box">
                        <div className="input-label"><p>이름</p></div>
                        <input></input>
                    </div>
                    <div className="promo-text"><p>시립대 최고의 타이핑 마스터에 도전하세요!</p></div>
                    <div className="input-box">
                        <input></input>
                        <div className="input-label"><p>전화번호</p></div>
                    </div>
                        <div className="promo-text"><p>단어 타이핑 배틀! 누구보다 빠르게, 정확하게</p></div>
                </div>
                <div className="right-subcontainer">
                    <h3>Rule</h3>
                    <ul>
                        <li>팀 내에서 입력한 단어들이
                            실시간으로 화면에서 사라진다.</li>
                        <li>모든 자원이 없어질 때까지
                            입력한 글자수대로 점수 부여한다.</li>
                        <li>제한 시간 내에 모든 자원이
                            없어지지 않는다면 팀 전체가
                            탈락한다.</li>
                    </ul>
                </div>
            </div>
            <label>GAME START</label>
            <button></button>
        </div>
    )
}