import React, { useState } from 'react';

const ControlPanel = ({ 
    settings, 
    setSettings, 
    onFileUpload, 
    onLoadData, 
    onStartDraft, 
    onNextPick, 
    onManualPick, 
    onUndo,
    onReset, 
    onClearCache,
    onDownloadTemplate,
    onExport,
    draftStatus,
    isDataLoaded,
    darkMode,
    toggleDarkMode,
    hasFile,
    onPreview,
    swapSource,
    isRichMode,
    toggleRichMode,
    exportWithScores,
    setExportWithScores
}) => {
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    // 根據數值有效性回傳樣式
    const getInputStyle = (name, value) => {
        // 隊伍數量與每隊人數必須大於 0
        if ((name === 'teamsCount' || name === 'teammatesPerTeam') && value <= 0) {
            return { borderColor: 'var(--danger)', borderWidth: '2px', outline: 'none' };
        }
        // 分數不應為負數
        if ((name === 'minScore' || name === 'maxScore') && value < 0) {
            return { borderColor: 'var(--danger)', borderWidth: '2px', outline: 'none' };
        }
        return {};
    };

    // 檢查設定值是否有效
    const isSettingsInvalid = 
        settings.teamsCount <= 0 || 
        settings.teammatesPerTeam <= 0 || 
        settings.minScore < 0 || 
        settings.maxScore < 0;

    return (
        <div className="control-panel">
            <div className="panel-header">
                <span className="panel-title">控制面板</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-outline btn-sm" onClick={toggleRichMode} title={isRichMode ? "切換為流暢模式 (關閉特效)" : "切換為精緻模式 (開啟特效)"}>
                        {isRichMode ? '💨' : '✨'}
                    </button>
                    <button className="btn-outline btn-sm" onClick={toggleDarkMode} title="切換深色/淺色模式">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button className="btn-outline btn-sm" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? '展開' : '收合'}
                        <span className={`arrow-icon ${!isCollapsed ? 'rotated' : ''}`}>▼</span>
                    </button>
                </div>
            </div>

            <div className={`panel-body ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="panel-content">
                    {/* 第一區：設定與資料 */}
                    <div className="control-group settings-group">
                        <div className="input-row">
                            <div className="input-group">
                                <label>隊伍數</label>
                                <input 
                                    type="number" 
                                    name="teamsCount" 
                                    value={settings.teamsCount} 
                                    onChange={handleInputChange} 
                                    disabled={isDataLoaded} 
                                    style={getInputStyle('teamsCount', settings.teamsCount)}
                                />
                            </div>
                            <div className="input-group">
                                <label>每隊人數</label>
                                <input 
                                    type="number" 
                                    name="teammatesPerTeam" 
                                    value={settings.teammatesPerTeam} 
                                    onChange={handleInputChange} 
                                    disabled={isDataLoaded} 
                                    style={getInputStyle('teammatesPerTeam', settings.teammatesPerTeam)}
                                />
                            </div>
                            <div className="input-group">
                                <label>最小分</label>
                                <input 
                                    type="number" 
                                    name="minScore" 
                                    value={settings.minScore} 
                                    onChange={handleInputChange} 
                                    style={getInputStyle('minScore', settings.minScore)}
                                />
                            </div>
                            <div className="input-group">
                                <label>最大分</label>
                                <input 
                                    type="number" 
                                    name="maxScore" 
                                    value={settings.maxScore} 
                                    onChange={handleInputChange} 
                                    style={getInputStyle('maxScore', settings.maxScore)}
                                />
                            </div>
                        </div>
                        
                        <div className="file-actions">
                            <div className="file-input-wrapper">
                                <button className="btn-outline btn-sm">📂 選擇檔案</button>
                                <input type="file" accept=".xlsx, .xls" onChange={(e) => {
                                    onFileUpload(e);
                                    e.target.value = ''; 
                                }} />
                            </div>
                            <button className="btn-outline btn-sm" onClick={onDownloadTemplate}>
                                📥 範本
                            </button>
                            <button className="btn-outline btn-sm" onClick={onPreview} disabled={!hasFile}>
                                👀 預覽
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 第二區：選秀操作 */}
            {isDataLoaded && !draftStatus.isDrafting && !draftStatus.isComplete && (
                <div className="control-group action-group">
                    <button className="btn-primary" onClick={() => onStartDraft(true)}>
                        🚀 自動選秀
                    </button>
                    <button className="btn-primary" onClick={onNextPick}>
                        ➡️ 下一步
                    </button>
                    <button className="btn-primary" onClick={onManualPick}>
                        👆 手動選人
                    </button>
                    <button className="btn-outline" onClick={onUndo} disabled={draftStatus.currentPickIndex === 0}>
                        ↩️ 上一步
                    </button>
                </div>
            )}

            {/* 第三區：結果與系統 */}
            {draftStatus.isComplete && (
                <div className="control-group result-group">
                    <div className="swap-hint" style={{ color: swapSource ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '10px' }}>
                        {swapSource ? `已選取: ${swapSource.player.name} (點擊另一人交換)` : "💡 點擊/拖曳隊員可進行交換"}
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '0.95em' }}>
                        <input 
                            type="checkbox" 
                            checked={exportWithScores} 
                            onChange={(e) => setExportWithScores(e.target.checked)} 
                        />
                        匯出分數
                    </label>

                    <button className="btn-success" onClick={onExport}>
                        💾 匯出結果
                    </button>
                </div>
            )}

            <div className="control-group system-group">
                <button className="btn-primary btn-sm" onClick={onLoadData} disabled={isDataLoaded || isSettingsInvalid}>
                    📥 載入
                </button>
                <button className="btn-outline btn-sm" onClick={onReset}>
                    🔄 重置
                </button>
                <button className="btn-outline btn-sm" onClick={onClearCache} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                    🗑️ 清除
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;