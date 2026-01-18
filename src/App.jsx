import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import ControlPanel from './components/ControlPanel';
import TeamCard from './components/TeamCard';
import StatusBar from './components/StatusBar';
import ManualModal from './components/ManualModal';
import DataPreviewModal from './components/DataPreviewModal';
import { DraftLogic } from './utils/DraftLogic';

function App() {
    // 設定狀態
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('draftSettings');
        const defaultSettings = {
            teamsCount: 20,
            teammatesPerTeam: 3,
            minScore: 12,
            maxScore: 15
        };
        if (saved) {
            try { return { ...defaultSettings, ...JSON.parse(saved) }; } catch (e) { return defaultSettings; }
        }
        return defaultSettings;
    });

    // 監聽設定變更並儲存
    useEffect(() => {
        localStorage.setItem('draftSettings', JSON.stringify(settings));
    }, [settings]);

    // Dark Mode 狀態
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('draftDarkMode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('draftDarkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Rich Mode (精緻模式/特效開關)
    const [isRichMode, setIsRichMode] = useState(() => {
        const saved = localStorage.getItem('draftRichMode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('draftRichMode', JSON.stringify(isRichMode));
        if (isRichMode) {
            document.body.classList.add('rich-mode');
        } else {
            document.body.classList.remove('rich-mode');
        }
    }, [isRichMode]);

    // 資料狀態
    const [allPlayers, setAllPlayers] = useState(() => {
        try {
            const saved = localStorage.getItem('draftPlayers');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // 監聽名單變更並儲存
    useEffect(() => {
        if (allPlayers.length > 0) {
            localStorage.setItem('draftPlayers', JSON.stringify(allPlayers));
        } else {
            localStorage.removeItem('draftPlayers');
        }
    }, [allPlayers]);

    const [teams, setTeams] = useState(() => {
        const saved = localStorage.getItem('draftTeams');
        return saved ? JSON.parse(saved) : [];
    });
    const [draftOrder, setDraftOrder] = useState(() => {
        const saved = localStorage.getItem('draftOrder');
        return saved ? JSON.parse(saved) : [];
    });
    const [availablePlayers, setAvailablePlayers] = useState(() => {
        const saved = localStorage.getItem('draftAvailablePlayers');
        return saved ? JSON.parse(saved) : [];
    });

    // 狀態持久化：監聽變更並儲存
    useEffect(() => {
        if (teams.length > 0) localStorage.setItem('draftTeams', JSON.stringify(teams));
        else localStorage.removeItem('draftTeams');
    }, [teams]);

    useEffect(() => {
        if (draftOrder.length > 0) localStorage.setItem('draftOrder', JSON.stringify(draftOrder));
        else localStorage.removeItem('draftOrder');
    }, [draftOrder]);

    useEffect(() => {
        if (availablePlayers.length > 0) localStorage.setItem('draftAvailablePlayers', JSON.stringify(availablePlayers));
        else localStorage.removeItem('draftAvailablePlayers');
    }, [availablePlayers]);
    
    // 流程狀態
    const [isDataLoaded, setIsDataLoaded] = useState(() => {
        const saved = localStorage.getItem('draftIsDataLoaded');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('draftIsDataLoaded', JSON.stringify(isDataLoaded));
    }, [isDataLoaded]);

    const [draftStatus, setDraftStatus] = useState(() => {
        const savedStatus = localStorage.getItem('draftRuntimeStatus');
        if (savedStatus) {
            const parsed = JSON.parse(savedStatus);
            return { ...parsed, isDrafting: false }; // 重新整理後暫停自動選秀
        }
        const hasData = localStorage.getItem('draftPlayers');
        return {
            currentPickIndex: 0,
            isDrafting: false,
            isComplete: false,
            message: hasData ? "已還原上次的名單，請載入設定" : "請上傳名單並載入設定",
            messageType: hasData ? "success" : "normal",
            progress: 0
        };
    });

    useEffect(() => {
        localStorage.setItem('draftRuntimeStatus', JSON.stringify(draftStatus));
    }, [draftStatus]);

    // 自動修復機制：當偵測到嚴重資料損毀（狀態顯示已載入但無資料）時，自動重置
    useEffect(() => {
        // 增加 settings.teamsCount > 0 的檢查，避免因設定錯誤導致的無限迴圈
        if (isDataLoaded && (teams.length === 0 || allPlayers.length === 0) && settings.teamsCount > 0) {
            localStorage.clear();
            sessionStorage.setItem('draftAutoRepaired', 'true');
            window.location.reload();
        }
    }, [isDataLoaded, teams, allPlayers, settings.teamsCount]);

    // 檢查是否剛執行過自動修復，並顯示提示訊息
    useEffect(() => {
        if (sessionStorage.getItem('draftAutoRepaired')) {
            setDraftStatus(prev => ({ ...prev, message: "系統已自動修復損毀的資料", messageType: "success" }));
            sessionStorage.removeItem('draftAutoRepaired');
        }
    }, []);

    // 監聽捲動事件，控制 Header 陰影
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 動態計算 Header 高度
    const headerRef = useRef(null);
    useEffect(() => {
        const updateHeaderOffset = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight;
                // 設定 CSS 變數，加上 20px 的緩衝空間
                document.documentElement.style.setProperty('--header-offset', `${height + 20}px`);
            }
        };

        // 使用 ResizeObserver 監聽元素大小變化 (比 window resize 更準確)
        const resizeObserver = new ResizeObserver(updateHeaderOffset);
        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    // Modal 狀態
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // 交換模式狀態
    const [swapSource, setSwapSource] = useState(null); // { teamIndex, player }

    // Loading 狀態
    const [isLoading, setIsLoading] = useState(false);

    // 自動捲動邏輯 (Auto Scroll on Drag)
    useEffect(() => {
        const handleWindowDragOver = (e) => {
            if (!draftStatus.isComplete) return;
            
            const threshold = 100; // 距離邊緣多少像素開始捲動
            const speed = 20; // 捲動速度
            
            if (e.clientY < threshold) {
                window.scrollBy({ top: -speed, behavior: 'auto' });
            } else if (e.clientY > window.innerHeight - threshold) {
                window.scrollBy({ top: speed, behavior: 'auto' });
            }
        };

        window.addEventListener('dragover', handleWindowDragOver);
        return () => window.removeEventListener('dragover', handleWindowDragOver);
    }, [draftStatus.isComplete]);

    // 處理檔案上傳
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // 依照需求只抓取 captain_name, name, score 欄位，忽略其他
            const formattedData = data.map((row, index) => {
                return {
                    id: index,
                    name: row['name'] || row['Name'] || row['姓名'] || `Player ${index}`,
                    score: row['score'] || row['Score'] || row['sorce'] || row['分數'] || 0,
                    captain_name: row['captain_name'] || row['Captain_Name'] || null
                };
            }).filter(p => p.name && p.score !== undefined);

            setAllPlayers(formattedData);
            setDraftStatus(prev => ({ ...prev, message: `已讀取 ${formattedData.length} 位隊員資料`, messageType: 'success' }));
        };
        reader.readAsBinaryString(file);
    };

    // 載入並初始化
    const handleLoadData = () => {
        if (allPlayers.length === 0) {
            setDraftStatus(prev => ({ ...prev, message: "請先上傳 Excel 檔案", messageType: "error" }));
            return;
        }

        if (!settings.teamsCount || settings.teamsCount <= 0) {
            setDraftStatus(prev => ({ ...prev, message: "隊伍數量設定錯誤 (必須大於 0)", messageType: "error" }));
            return;
        }

        // 驗證：檢查名單人數是否足夠
        const totalSlotsNeeded = settings.teamsCount * settings.teammatesPerTeam;
        if (allPlayers.length < totalSlotsNeeded) {
            const errorMsg = `名單人數不足！設定需求 ${totalSlotsNeeded} 人 (20隊 x 6人)，但目前僅 ${allPlayers.length} 人。`;
            setDraftStatus(prev => ({ ...prev, message: errorMsg, messageType: "error" }));
            alert(`⚠️ 警告：${errorMsg}\n\n請調整「隊伍數量」或「每隊人數」，或是上傳更完整的名單。`);
            return; // 停止載入，避免程式跑版
        }

        // 初始化隊伍
        const newTeams = Array.from({ length: settings.teamsCount }, (_, i) => {
            // 嘗試從 Excel 找隊長 (假設第 i 筆資料對應第 i 隊，且有 captain_name)
            const captainCandidate = allPlayers[i];
            const hasCaptain = captainCandidate && captainCandidate.captain_name;
            
            return {
                id: i,
                // 若無隊長名字，使用 Team + 數字
                name: hasCaptain ? captainCandidate.captain_name : `Team ${i + 1}`,
                score: 0,
                roster: []
            };
        });

        // 產生完整的選秀順序
        let order = DraftLogic.generateDraftOrder(settings.teamsCount, settings.teammatesPerTeam);
        
        // 所有隊員皆可選 (不預先扣除)
        const available = [...allPlayers];
        
        setTeams(newTeams);
        setDraftOrder(order);
        setAvailablePlayers(available);
        setIsDataLoaded(true);
        setDraftStatus({
            currentPickIndex: 0,
            isDrafting: false,
            isComplete: false,
            message: "準備就緒，請選擇選秀模式",
            messageType: "success",
            progress: 0
        });
    };

    // 執行單次選秀 (核心)
    const executePick = useCallback((manualPlayer = null) => {
        if (draftStatus.currentPickIndex >= draftOrder.length) {
            setDraftStatus(prev => ({ ...prev, isComplete: true, message: "選秀完成！", messageType: "success", isDrafting: false }));
            return false;
        }

        const teamIndex = draftOrder[draftStatus.currentPickIndex];
        const currentTeam = teams[teamIndex];
        let playerToPick = manualPlayer;

        if (!playerToPick) {
            // 自動選擇邏輯
            const { valid, error } = DraftLogic.getSmartValidPlayers(
                teamIndex, 
                teams, 
                availablePlayers, 
                settings, 
                settings.teammatesPerTeam
            );

            if (error && !valid.length) {
                setDraftStatus(prev => ({ ...prev, message: `錯誤：${currentTeam.name} 無法選人 - ${error}`, messageType: "error", isDrafting: false }));
                return false;
            }

            // 使用 Softmax 選擇
            playerToPick = DraftLogic.weightedChoiceSoftmax(valid);
        }

        if (!playerToPick) return false;

        // 更新狀態
        const newTeams = [...teams];
        newTeams[teamIndex].roster.push(playerToPick);
        newTeams[teamIndex].score += playerToPick.score;
        setTeams(newTeams);

        setAvailablePlayers(prev => prev.filter(p => p.id !== playerToPick.id));
        
        const nextIndex = draftStatus.currentPickIndex + 1;
        const progress = (nextIndex / draftOrder.length) * 100;
        
        setDraftStatus(prev => ({
            ...prev,
            currentPickIndex: nextIndex,
            progress: progress,
            message: `輪次 ${nextIndex}: ${currentTeam.name} 選擇了 ${playerToPick.name}`,
            isComplete: nextIndex >= draftOrder.length
        }));

        return true;
    }, [draftStatus.currentPickIndex, draftOrder, teams, availablePlayers, settings]);

    // 上一步 (Undo)
    const handleUndo = useCallback(() => {
        if (draftStatus.currentPickIndex <= 0) return;

        const prevIndex = draftStatus.currentPickIndex - 1;
        const teamIndex = draftOrder[prevIndex];
        
        const newTeams = [...teams];
        const team = newTeams[teamIndex];
        
        // 取出最後加入的隊員
        const playerToRemove = team.roster.pop();
        team.score -= playerToRemove.score;

        setTeams(newTeams);
        setAvailablePlayers(prev => [playerToRemove, ...prev]); // 加回選秀池
        
        const progress = (prevIndex / draftOrder.length) * 100;

        setDraftStatus(prev => ({
            ...prev,
            currentPickIndex: prevIndex,
            isComplete: false,
            isDrafting: false, // 暫停自動選秀
            message: `已復原 ${team.name} 的選擇`,
            progress: progress
        }));
    }, [draftStatus.currentPickIndex, draftOrder, teams]);

    // 執行交換核心邏輯
    const performSwap = useCallback((sourceTeamIdx, sourceP, targetTeamIdx, targetP) => {
        const newTeams = [...teams];

        if (sourceTeamIdx === targetTeamIdx) {
            // 同隊交換：複製隊伍物件並一次性更新名單，避免覆蓋問題
            const team = { ...newTeams[sourceTeamIdx] };
            team.roster = team.roster.map(p => {
                if (p.id === sourceP.id) return targetP;
                if (p.id === targetP.id) return sourceP;
                return p;
            });
            newTeams[sourceTeamIdx] = team;
        } else {
            // 異隊交換：複製兩個隊伍物件
            const sourceTeam = { ...newTeams[sourceTeamIdx] };
            const targetTeam = { ...newTeams[targetTeamIdx] };

            sourceTeam.roster = sourceTeam.roster.map(p => p.id === sourceP.id ? targetP : p);
            targetTeam.roster = targetTeam.roster.map(p => p.id === targetP.id ? sourceP : p);

            sourceTeam.score = sourceTeam.score - sourceP.score + targetP.score;
            targetTeam.score = targetTeam.score - targetP.score + sourceP.score;

            newTeams[sourceTeamIdx] = sourceTeam;
            newTeams[targetTeamIdx] = targetTeam;
        }

        setTeams(newTeams);
        setDraftStatus(prev => ({ ...prev, message: `已交換: ${sourceP.name} ↔ ${targetP.name}`, messageType: 'success' }));
    }, [teams]);

    // 處理隊員交換 (點擊)
    const handlePlayerClick = useCallback((teamIndex, player) => {
        if (!draftStatus.isComplete) return;

        if (swapSource) {
            if (swapSource.player.id === player.id) {
                setSwapSource(null); // 取消選取
            } else {
                performSwap(swapSource.teamIndex, swapSource.player, teamIndex, player);
                setSwapSource(null);
            }
        } else {
            setSwapSource({ teamIndex, player });
        }
    }, [draftStatus.isComplete, swapSource, performSwap]);

    // 一次性自動選秀 (Instant Auto Draft)
    const handleAutoDraft = () => {
        setIsLoading(true);
        
        // 使用 setTimeout 讓 UI 有機會渲染 Loading 遮罩
        setTimeout(() => {
            const maxAttempts = 1000;
            let success = false;
            
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                let currentTeams = JSON.parse(JSON.stringify(teams));
                let currentAvailable = [...availablePlayers];
                let currentIndex = draftStatus.currentPickIndex;
                
                try {
                    while (currentIndex < draftOrder.length) {
                        const teamIndex = draftOrder[currentIndex];
                        const currentTeam = currentTeams[teamIndex];

                        const { valid, error } = DraftLogic.getSmartValidPlayers(
                            teamIndex, 
                            currentTeams, 
                            currentAvailable, 
                            settings, 
                            settings.teammatesPerTeam
                        );

                        if (error && !valid.length) {
                            throw new Error(`${currentTeam.name} 無法選人 - ${error}`);
                        }

                        const playerToPick = DraftLogic.weightedChoiceSoftmax(valid);
                        
                        currentTeam.roster.push(playerToPick);
                        currentTeam.score += playerToPick.score;
                        currentAvailable = currentAvailable.filter(p => p.id !== playerToPick.id);
                        
                        currentIndex++;
                    }

                    setTeams(currentTeams);
                    setAvailablePlayers(currentAvailable);
                    setDraftStatus(prev => ({
                        ...prev,
                        currentPickIndex: currentIndex,
                        progress: 100,
                        message: `自動選秀完成！(嘗試 ${attempt + 1} 次)`,
                        messageType: "success",
                        isComplete: true,
                        isDrafting: false
                    }));
                    success = true;
                    break;

                } catch (err) {
                    if (attempt === maxAttempts - 1) {
                        setTeams(currentTeams);
                        setAvailablePlayers(currentAvailable);
                        setDraftStatus(prev => ({ 
                            ...prev, 
                            message: `自動選秀失敗 (已嘗試 ${maxAttempts} 次)：${err.message}`, 
                            messageType: "error", 
                            isDrafting: false,
                            currentPickIndex: currentIndex,
                            progress: (currentIndex / draftOrder.length) * 100
                        }));
                    }
                }
            }
            setIsLoading(false);
        }, 50);
    };

    // 手動選人處理
    const handleManualSelect = useCallback((player) => {
        executePick(player);
        setIsModalOpen(false);
    }, [executePick]);

    // 匯出 Excel
    const handleExport = () => {
        const data = teams.map(t => {
            const row = { "隊伍": t.name, "總分": t.score };
            t.roster.forEach((p, i) => {
                row[`隊員 ${i+1}`] = `${p.name} (${p.score})`;
            });
            return row;
        });
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Result");
        XLSX.writeFile(wb, "DraftResult.xlsx");
    };

    // 下載範本
    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.aoa_to_sheet([
            ['captain_name', 'name', 'score'],
            ['Team 1', 'Player A', 10],
            ['', 'Player B', 8],
            ['Team 2', 'Player C', 12]
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "DraftTemplate.xlsx");
    };

    // 重置
    const handleReset = useCallback(() => {
        setIsDataLoaded(false);
        setTeams([]);
        setSwapSource(null);
        setDraftOrder([]);
        setAvailablePlayers([]);
        setDraftStatus({
            currentPickIndex: 0,
            isDrafting: false,
            isComplete: false,
            message: "已重置",
            messageType: "normal",
            progress: 0
        });
    }, []);

    // 清除所有暫存
    const handleClearCache = () => {
        if (window.confirm("確定要清除所有暫存資料嗎？這將會刪除所有設定、名單與選秀進度，並重新整理頁面。")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    // 取得當前正在選秀的隊伍 ID
    const activeTeamIndex = isDataLoaded && !draftStatus.isComplete 
        ? draftOrder[draftStatus.currentPickIndex] 
        : -1;

    // 偵測異常狀態：顯示已載入但無資料(資料損毀)，或有錯誤訊息
    const isAbnormal = (isDataLoaded && (teams.length === 0 || allPlayers.length === 0)) || draftStatus.messageType === 'error';

    return (
        <div className="container">
            {/* Loading 遮罩 */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <div className="loading-text">正在計算最佳選秀組合...</div>
                </div>
            )}

            {/* 緊急清除暫存按鈕 - 只在異常時顯示 */}
            {isAbnormal && (
                <button 
                    onClick={handleClearCache}
                    style={{
                        position: 'fixed', top: '10px', right: '10px', zIndex: 9999,
                        padding: '8px 12px', background: '#d32f2f', color: 'white', 
                        border: 'none', borderRadius: '4px', cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                    }}
                >
                    🆘 緊急重置
                </button>
            )}

            <div ref={headerRef} className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="brand-container">
                    <svg className="viper-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* 蛇身 (S型) */}
                        <path d="M7 21c-3 0-4-2-4-4 0-3 2-4 5-4 3 0 4-2 4-4 0-3-2-4-5-4" />
                        {/* 蛇信 (舌頭) */}
                        <path d="M7 5l-2-3" />
                        <path d="M7 5l2-3" />
                    </svg>
                    <h1>ViperDraft</h1>
                </div>
                
                <div className="header-section">
                    <ControlPanel 
                        settings={settings}
                        setSettings={setSettings}
                        onFileUpload={handleFileUpload}
                        onLoadData={handleLoadData}
                        onStartDraft={handleAutoDraft}
                        onNextPick={() => executePick()}
                        onManualPick={() => setIsModalOpen(true)}
                        onUndo={handleUndo}
                        onReset={handleReset}
                        onClearCache={handleClearCache}
                        onDownloadTemplate={handleDownloadTemplate}
                        onExport={handleExport}
                        draftStatus={draftStatus}
                        isDataLoaded={isDataLoaded}
                        darkMode={darkMode}
                        toggleDarkMode={() => setDarkMode(!darkMode)}
                        hasFile={allPlayers.length > 0}
                        onPreview={() => setIsPreviewOpen(true)}
                        swapSource={swapSource}
                        isRichMode={isRichMode}
                        toggleRichMode={() => setIsRichMode(!isRichMode)}
                    />
                    <StatusBar message={draftStatus.message} progress={draftStatus.progress} type={draftStatus.messageType} />
                </div>
            </div>

            <div className="teams-grid">
                {teams.map((team, index) => (
                    <TeamCard 
                        key={team.id} 
                        team={team} 
                        index={index}
                        isActive={index === activeTeamIndex}
                        minScore={settings.minScore}
                        maxScore={settings.maxScore}
                        onPlayerClick={(player) => handlePlayerClick(index, player)}
                        isSwapMode={draftStatus.isComplete}
                        swapSource={swapSource}
                        onPlayerSwap={performSwap}
                    />
                ))}
            </div>

            <ManualModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                team={activeTeamIndex !== -1 ? teams[activeTeamIndex] : null}
                availablePlayers={availablePlayers}
                onSelect={handleManualSelect}
                teams={teams}
                settings={settings}
                teammatesPerTeam={settings.teammatesPerTeam}
            />

            <DataPreviewModal 
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={allPlayers}
            />
        </div>
    );
}

export default App;