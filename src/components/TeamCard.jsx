import React, { useEffect, useRef, useState } from 'react';
import './TeamCard.css';

const TeamCard = ({ team, index, isActive, minScore, maxScore, onPlayerClick, isSwapMode, swapSource, onPlayerSwap }) => {
    const cardRef = useRef(null);
    const [dragOverId, setDragOverId] = useState(null);

    // 自動捲動到當前卡片
    useEffect(() => {
        if (isActive && cardRef.current) {
            // 延遲捲動以確保 Header 高度計算完成，改用 center 確保一定會捲動定位
            const timer = setTimeout(() => {
                cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    // 判斷分數狀態
    const isScoreOk = team.score >= minScore && team.score <= maxScore;
    const scoreClass = isScoreOk ? 'score-ok' : 'score-bad';
    const remaining = maxScore - team.score;

    // 拖曳處理
    const handleDragStart = (e, player) => {
        if (!isSwapMode) return;
        e.dataTransfer.setData("application/json", JSON.stringify({ teamIndex: index, player }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        if (!isSwapMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e, player) => {
        if (!isSwapMode) return;
        e.preventDefault();
        setDragOverId(player.id);
    };

    const handleDragLeave = (e) => {
        if (!isSwapMode) return;
        // 防止滑鼠移動到子元素時觸發 leave
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setDragOverId(null);
    };

    const handleDrop = (e, targetPlayer) => {
        if (!isSwapMode) return;
        e.preventDefault();
        setDragOverId(null); // 清除懸停狀態
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            if (data.teamIndex === index && data.player.id === targetPlayer.id) return;
            
            onPlayerSwap(data.teamIndex, data.player, index, targetPlayer);
        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    return (
        <div 
            ref={cardRef}
            className={`team-card ${isActive ? 'active' : ''}`}
        >
            {isActive && (
                <div className="picking-badge">
                    {/* 拆解字串以套用波浪動畫 */}
                    {"Picking...".split("").map((char, i) => (
                        <span 
                            key={i} 
                            className="picking-char" 
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            )}

            <div className="team-header">
                <div className="team-name">{team.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div className={`team-score score-badge ${scoreClass}`}>
                        {team.score} 分
                    </div>
                    <div style={{ fontSize: '0.75em', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        剩餘: {remaining}
                    </div>
                </div>
            </div>

            <ul className="player-list">
                {team.roster.map((player, idx) => (
                    <li 
                        key={player.id || idx} 
                        className={`player-item ${isSwapMode ? 'swappable' : ''} ${swapSource?.player?.id === player.id ? 'selected-swap' : ''} ${dragOverId === player.id ? 'drag-over' : ''}`}
                        onClick={() => isSwapMode && onPlayerClick(player)}
                        draggable={isSwapMode}
                        onDragStart={(e) => handleDragStart(e, player)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, player)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, player)}
                    >
                        <span>{player.name}</span>
                        <span className="player-score">{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamCard;