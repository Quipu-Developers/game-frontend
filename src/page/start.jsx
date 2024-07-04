import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/start.css'

export default function Start() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/game');
    };
    return (
        <div className="start-container">
            <h1>배틀글라운드</h1>
            <div className="start-subcontainer">
                <div className="window">
                    <div className="window-bar"><p>● ● ●</p></div>
                    <div className="window-left">
                        <div className="input-box">
                            <div style={{ width: '30%' }}><p>학번</p></div>
                            <input style={{ width: '65%' }}></input>
                        </div>
                        <div className="input-box">
                            <div style={{ width: '45%' }}><p>이름</p></div>
                            <input style={{ width: '50%' }}></input>
                        </div>
                        <div className="promo-text"><p>누구보다 빠르고 정확하게</p></div>
                        <div className="input-box">
                            <input style={{ width: '70%' }}></input>
                            <div style={{ width: '25%' }}><p>전화번호</p></div>
                        </div>
                        <div className="promo-text"><p>UOS 최고의 타이핑 마스터에 도전하세요!</p></div>
                    </div>
                </div>
                <div className="window">
                    <div className="window-bar"><p>● ● ●</p></div>
                    <div className="window-middle">
                        <h3>게임 방법 🌟</h3>
                        <ul>
                            <li>✔️ 단어들을 빠르게 입력해서 없애세요! 🚀</li>
                            <li>✔️ 팀원보다 <span className="highlight">먼저 입력</span>하여 단어를 낚아채세요!</li>
                            <li>✔️ <span className="highlight">최대한 많은 글자</span>를 입력할수록 점수가 높아집니다 💪</li>
                        </ul>
                        <h3>점수 🏆</h3>
                        <ul>
                            <li>✔️ 입력한 글자 수만큼 점수가 부여되고 <span className="highlight">팀 내 순위</span>가 결정됩니다!</li>
                            <li>✔️ <span className="highlight">남은 시간</span> 합산으로 전체 등수가 결정됩니다! top 10에 도전해보세요! 😘</li>
                            <li>✔️ 시간 내에 모든 단어를 제거하지 못하면 <span className="highlight">팀 전체 탈락</span>합니다! ⚠️</li>
                        </ul>
                    </div>
                </div>
                <div className="window">
                    <div className="window-bar"><p>● ● ●</p></div>
                    <div className="window-right">
                        <h3>게임 방법 🌟</h3>
                        <ul>
                            <li>✔️ 단어들을 빠르게 입력해서 없애세요! 🚀</li>
                            <li>✔️ 팀원보다 <span className="highlight">먼저 입력</span>하여 단어를 낚아채세요!</li>
                            <li>✔️ <span className="highlight">최대한 많은 글자</span>를 입력할수록 점수가 높아집니다 💪</li>
                        </ul>
                        <h3>점수 🏆</h3>
                        <ul>
                            <li>✔️ 입력한 글자 수만큼 점수가 부여되고 <span className="highlight">팀 내 순위</span>가 결정됩니다!</li>
                            <li>✔️ <span className="highlight">남은 시간</span> 합산으로 전체 등수가 결정됩니다! top 10에 도전해보세요! 😘</li>
                            <li>✔️ 시간 내에 모든 단어를 제거하지 못하면 <span className="highlight">팀 전체 탈락</span>합니다! ⚠️</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="start-button-container">
                <label>GAME START</label>
                <div onClick={handleStartClick}></div>
            </div>
        </div>
    )
}