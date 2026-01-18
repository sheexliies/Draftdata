# ViperDraft (S-Type Draft Simulator)

[![Online Demo](https://img.shields.io/badge/Online-Demo-blue)](https://sheexliies.github.io/ViperDraft/)
![Coding by](https://img.shields.io/badge/Coding%20by-Gemini%203%20Pro-orange)

[English](#english) | [中文](#chinese)

<a name="english"></a>
## en English Description

**ViperDraft** is a web-based draft simulation tool built with React and Vite, designed for scenarios requiring balanced team strengths (e.g., gaming tournaments, group activities). It combines **Snake Draft** order with **Softmax Weighted Random Algorithm** and features intelligent deadlock prevention mechanisms to ensure every team completes their roster within score limits.

### ✨ Key Features

#### Core Draft Mechanics
*   **Snake Draft Order**: Ensures fair drafting positions; the team picking last in the first round picks first in the second.
*   **Smart Auto-Draft**:
    *   Uses **Softmax Weighted Random** algorithm for probabilistic selection among eligible players.
    *   **Global Feasibility Check**: Predicts if a current selection will cause a deadlock for other teams and avoids high-risk choices.
    *   **Instant Calculation**: Supports one-click instant calculation for all rounds with a loading overlay.
*   **Score Constraints**: Strictly adheres to "Min Score" and "Max Score" limits per team.

#### Interface & Operation
*   **Control Panel**:
    *   Collapsible to save screen space.
    *   **Quick Toggles**: Top-right buttons for Dark Mode and **Rich/Performance Mode**.
*   **Manual Pick**:
    *   Search functionality.
    *   **Risk Analysis**: Displays selection risk (✅ Safe, ⚠️ Risk, ❌ Invalid) with detailed tooltips.
*   **Visual Cards**:
    *   Displays team score and **Remaining Budget**.
    *   **Picking Animation**: Wave text animation and flash highlight for the active team.
    *   **Auto-Scroll**: Automatically scrolls to the current drafting team.
*   **Visual Customization**:
    *   **Dark Mode**: One-click toggle between Dark/Light themes with auto-save.
    *   **Rich / Performance Mode**: Toggle between rich Glassmorphism effects (Rich Mode) and a static mode optimized for speed (Performance Mode).

#### Data Management
*   **Excel Import/Export**:
    *   Supports `.xlsx` / `.xls` formats.
    *   Automatically reads `captain_name`, `name`, and `score` columns.
    *   **Template Download**: Provides a standard Excel template.
    *   **Data Preview**: Preview imported data directly in the UI.
*   **Persistence**:
    *   All settings, rosters, and draft progress are automatically saved to **LocalStorage**.
    *   Seamlessly resume operations after page reload.
    *   **Auto-Repair**: Detects data corruption and automatically resets with a notification.

#### Post-Draft Management
*   **Player Swapping**:
    *   **Drag & Drop**: Intuitively drag players to other teams to swap.
    *   **Click Swap**: Click two players to swap them.
    *   Supports auto-scrolling when dragging near screen edges.
*   **Undo**: Revert the last selection at any time.
*   **Export Results**: Export final groupings to an Excel file.

### 🚀 Installation & Run

This project is built using Node.js and Vite.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

---

<a name="chinese"></a>
## 🇹🇼 中文說明

**ViperDraft** 是一個基於 React 與 Vite 開發的網頁版選秀模擬工具，專為需要平衡隊伍實力（如遊戲競賽、分組活動）的場景設計。它結合了 **S 型選秀 (Snake Draft)** 順序與 **Softmax 加權隨機演算法**，並具備智慧型的防死鎖機制，確保每支隊伍都能在分數限制內完成組隊。

### ✨ 主要功能

#### 核心選秀機制
*   **S 型選秀順序**：確保選秀順位公平，首輪最後選的隊伍將在次輪最先選。
*   **智慧自動選秀**：
    *   使用 **Softmax 加權隨機** 演算法，在符合條件的球員中進行機率性選擇。
    *   **全局可行性檢查 (Global Feasibility Check)**：預判當前選擇是否會導致其他隊伍無人可選（死鎖），並自動迴避高風險選擇。
    *   **瞬間演算**：支援一次性快速計算所有輪次，並附帶 Loading 遮罩。
*   **分數限制**：可設定每隊的「最小分數」與「最大分數」，系統會嚴格遵守限制。

#### 操作與介面
*   **控制面板**：
    *   可收合/展開，節省螢幕空間。
    *   **快速切換**：右上角按鈕可快速切換深色模式與 **精緻/流暢模式**。
    *   輸入防呆與紅框警告。
*   **手動選人 (Manual Pick)**：
    *   提供搜尋功能。
    *   **風險分析**：顯示球員選擇風險（✅ 安全、⚠️ 風險、❌ 分數不符），並支援滑鼠懸停查看詳細說明 (Tooltip)。
*   **視覺化卡片**：
    *   顯示隊伍分數與 **剩餘預算**。
    *   **Picking 動畫**：輪到該隊時顯示波浪文字動畫與高亮閃爍效果。
    *   **自動定位**：畫面會自動捲動至當前選秀隊伍。
*   **視覺自訂**：
    *   **暗黑模式 (Dark Mode)**：支援一鍵切換深色/淺色主題。
    *   **精緻 / 流暢模式**：可切換華麗的毛玻璃特效 (精緻模式) 與浮動動畫，或選擇流暢模式以獲得極致的效能體驗。

#### 資料管理
*   **Excel 匯入/匯出**：
    *   支援 `.xlsx` / `.xls` 格式。
    *   自動讀取 `captain_name` (隊長/隊名)、`name` (姓名)、`score` (分數) 欄位。
    *   提供 **標準範本下載** 功能。
    *   **名單預覽**：可直接在介面上預覽匯入的資料。
*   **資料持久化 (Persistence)**：
    *   所有設定、名單、選秀進度皆自動儲存於瀏覽器 **LocalStorage**。
    *   重新整理頁面後可無縫接續操作。
    *   **自動修復機制**：偵測資料損毀時自動重置並提示。

#### 選秀後管理
*   **隊員交換**：
    *   支援 **拖曳交換 (Drag & Drop)**：直覺地將球員拖至另一隊進行交換。
    *   支援 **點擊交換**：點擊兩名球員進行互換。
    *   拖曳時支援視窗邊緣自動捲動。
*   **上一步 (Undo)**：可隨時回溯上一次的選擇。
*   **結果匯出**：將最終分組結果匯出為 Excel 檔案。

### 🚀 安裝與執行

本專案使用 Node.js 與 Vite 建置。

1.  **安裝依賴**
    ```bash
    npm install
    ```

2.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

3.  **建置生產版本**
    ```bash
    npm run build
    ```

---

## 🛠️ Tech Stack / 技術棧

*   **Frontend Framework**: React 18
*   **Build Tool**: Vite
*   **Language**: JavaScript (ES6+)
*   **Styling**: CSS3 (Variables, Flexbox, Grid, Animations)
*   **Data Processing**: SheetJS (xlsx)
*   **Performance**: React.memo / useMemo optimizations, CSS will-change management

## 📂 Project Structure / 專案結構

```
ViperDraft/
├── src/
│   ├── components/
│   │   ├── ControlPanel.jsx    # 控制面板 (設定、按鈕群組)
│   │   ├── TeamCard.jsx        # 隊伍卡片 (顯示、拖曳邏輯)
│   │   ├── ManualModal.jsx     # 手動選人視窗
│   │   ├── DataPreviewModal.jsx# 資料預覽視窗
│   │   └── StatusBar.jsx       # 狀態列
│   ├── utils/
│   │   └── DraftLogic.js       # 核心演算法 (Softmax, 可行性檢查)
│   ├── App.jsx                 # 主程式邏輯
│   └── main.jsx                # 入口點
├── index.css                   # 全域樣式與動畫
└── index.html
```