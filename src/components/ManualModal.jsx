import React, { useState, useMemo, useRef } from 'react';
import { DraftLogic } from '../utils/DraftLogic';

const ManualModal = ({ isOpen, onClose, team, availablePlayers, onSelect, teams, settings, teammatesPerTeam }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tooltip, setTooltip] = useState(null); // { text, x, y, position }
    const timeoutRef = useRef(null);

    // 1. 使用 useMemo 快取風險計算結果
    // 只有當 isOpen, team 或名單改變時才重新計算，搜尋(打字)時不重算
    const analyzedPlayers = useMemo(() => {
        if (!isOpen || !team) return [];

        try {
            const analyzed = availablePlayers.map(player => {
                const risk = DraftLogic.analyzeRisk(
                    teams.indexOf(team), 
                    player, 
                    availablePlayers, 
                    teams, 
                    settings, 
                    teammatesPerTeam
                );
                return { ...player, risk };
            });
            
            // 排序：風險低 -> 分數高
            analyzed.sort((a, b) => {
                if (a.risk.level !== b.risk.level) return a.risk.level - b.risk.level;
                return b.score - a.score;
            });

            return analyzed;
        } catch (e) {
            console.error("Risk analysis failed", e);
            return availablePlayers;
        }
    }, [isOpen, team, availablePlayers, teams, settings, teammatesPerTeam]);

    if (!isOpen || !team) return null;

    // 2. 搜尋過濾獨立處理，打字時只執行這裡，非常快速
    const filteredPlayers = analyzedPlayers.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tooltip 處理：計算座標並顯示
    const handleTooltipEnter = (e, text) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const rect = e.currentTarget.getBoundingClientRect();
        const isBottom = rect.top < 100; // 距離頂部太近則顯示在下方
        setTooltip({
            text,
            x: rect.left + rect.width / 2,
            y: isBottom ? rect.bottom : rect.top,
            position: isBottom ? 'bottom' : 'top'
        });
    };

    const handleTooltipLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setTooltip(null);
        }, 200); // 200ms 緩衝時間讓滑鼠移動過去
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <span>為 {team.name} 選擇隊員 (目前 {team.score} 分)</span>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="search-container">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="搜尋隊員..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="modal-list">
                    {filteredPlayers.map(player => (
                        <div key={player.id} className="modal-item" onClick={() => onSelect(player)}>
                            <span>
                                <span 
                                    className="risk-badge" 
                                    style={{ cursor: 'help', marginRight: '6px' }}
                                    onMouseEnter={(e) => handleTooltipEnter(e, player.risk.description)}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    {player.risk.status}
                                </span>
                                {player.name}
                            </span>
                            <span>{player.score}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 全域 Tooltip：渲染在最外層以避免定位問題 */}
            {tooltip && (
                <div 
                    className={`global-tooltip ${tooltip.position}`} 
                    style={{ left: tooltip.x, top: tooltip.y }}
                    onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    }}
                    onMouseLeave={handleTooltipLeave}
                >
                    {tooltip.text}
                    <div className="tooltip-arrow"></div>
                </div>
            )}
        </div>
    );
};

export default ManualModal;