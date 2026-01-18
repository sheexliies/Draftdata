import React, { useState, useEffect } from 'react';
import { DraftLogic } from '../utils/DraftLogic';

const ManualModal = ({ isOpen, onClose, team, availablePlayers, onSelect, teams, settings, teammatesPerTeam }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [analyzedPlayers, setAnalyzedPlayers] = useState([]);

    useEffect(() => {
        if (isOpen && team) {
            // 計算所有球員的風險
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

            setAnalyzedPlayers(analyzed);
        }
    }, [isOpen, team, availablePlayers, searchTerm]);

    if (!isOpen || !team) return null;

    const filteredPlayers = analyzedPlayers.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 自動偵測 Tooltip 位置
    const handleTooltipEnter = (e) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        // 如果元素距離視窗頂部小於 50px (Tooltip 約略高度)，則標記顯示在下方
        if (rect.top < 50) {
            target.setAttribute('data-position', 'bottom');
        } else {
            target.removeAttribute('data-position'); // 否則維持預設 (上方)
        }
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
                                    className="tooltip-container" 
                                    data-tooltip={player.risk.description} 
                                    style={{ cursor: 'help', marginRight: '6px' }}
                                    onMouseEnter={handleTooltipEnter}
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
        </div>
    );
};

export default ManualModal;