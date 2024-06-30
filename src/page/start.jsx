import React from 'react';
import '../style/start.css'

export default function Start() {
    return (
        <div className="start-container">
            <h1>배틀글라운드</h1>
            <div className="start-subcontainer">
                <div className="start-subcontainer__bar"><p>● ● ●</p></div>
                <div className="left-subcontainer">
                    <div className="input-box">
                        <div style={{ width: '30%' }}><p>학번</p></div>
                        <input style={{ width: '65%' }}></input>
                    </div>
                    <div className="input-box">
                        <div style={{ width: '45%' }}><p>이름</p></div>
                        <input style={{ width: '50%' }}></input>
                    </div>
                    <div className="promo-text"><p>UOS 최고의 타이핑 마스터에 도전하세요!</p></div>
                    <div className="input-box">
                        <input style={{ width: '70%' }}></input>
                        <div style={{ width: '25%' }}><p>전화번호</p></div>
                    </div>
                    <div className="promo-text"><p>누구보다 빠르고 정확하게</p></div>
                </div>
                <div className="right-subcontainer">
                    <h3>Rule</h3>
                    <ul>
                        <li>1. 팀 내에서 입력한 단어들이<br></br><span className="highlight">실시간으로 화면에서 사라진다</span>.</li>
                        <li>2. 모든 자원이 없어질 때까지<br></br><span className="highlight">입력한 글자수대로 점수 부여한다</span>.</li>
                        <li>3. 제한 시간 내에 모든 자원이<br></br><span className="highlight">없어지지 않는다면 팀 전체가 탈락한다</span>.</li>
                    </ul>
                </div>
            </div>
            <div className="start-button-container">
                <label htmlFor="start-button">GAME START</label>
                <button id="start-button">▶</button>
            </div>
        </div>
    )
}
