# ViperDraft (S-Type Draft Simulator)

[![Online Demo](https://img.shields.io/badge/Online-Demo-blue)](https://sheexliies.github.io/ViperDraft/)
![Coding by](https://img.shields.io/badge/Coding%20by-Gemini%203%20Pro-orange)

[English](#english) | [中文](#chinese)

<a name="english"></a>
## en English Description

**ViperDraft** is a web-based draft simulation tool built with React and Vite, designed for scenarios requiring balanced team strengths (e.g., gaming tournaments, group activities). It combines **Snake Draft** order with **Softmax Weighted Random Algorithm** and features intelligent deadlock prevention mechanisms to ensure every team completes their roster within score limits.

> **🚀 Try it now!** Click the **[Online Demo](https://sheexliies.github.io/ViperDraft/)** badge above to use it directly in your browser without installation.

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
    *   Automatically reads `team`, `name`, and `score` columns.
    *   **Template Download**: Provides a standard Excel template.
    *   **Data Preview**: Preview imported data directly in the UI.
    *   **Smart Validation**: Automatically detects headers, filters invalid rows (score ≤ 0), and checks for **duplicate names**.
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
    *   **Customizable**: Option to include or exclude player scores in the export.

### 🚀 Getting Started

You can choose to use the online version directly or run it locally.

#### Option 1: Online Version (Recommended)
Simply click the link below to use it in your browser without installation.
*   **[👉 Launch ViperDraft Online](https://sheexliies.github.io/ViperDraft/)**

#### Option 2: Local Installation
If you are a developer or want to run it offline:

1.  **Prerequisites**: Node.js (v16+) and npm/yarn.
2.  **Install Dependencies**: `npm install`
3.  **Start Server**: `npm run dev`
4.  **Build**: `npm run build`

###  Usage Guide

Once you have opened the application (Online or Local):

1.  **Prepare Data**: Create an Excel file (`.xlsx`).
    *   **Columns**: `name` (Required), `score` (Required), `team` (Optional - for pre-assigned captains).
    *   *Tip: You can download a template directly from the control panel.*
2.  **Configuration**:
    *   Upload your file.
    *   Set **Teams Count**, **Players per Team**, and **Score Limits**.
    *   Click **Load** to initialize the draft board.
3.  **Drafting**:
    *   **Auto Draft**: Instantly complete the draft using the AI algorithm.
    *   **Manual Pick**: Click "Manual Pick" to search and select specific players for the current team.
4.  **Adjust & Export**:
    *   Drag and drop players to swap if needed.
    *   Click **Export Results** to save the final rosters.

### 🕹️ Button Guide

| Icon | Button | Description |
| :---: | :--- | :--- |
| 📂 | **Select File** | Upload your player list (`.xlsx`). |
| 📥 | **Template** | Download the standard Excel template. |
| 👀 | **Preview** | View the uploaded player data. |
| 📥 | **Load** | Initialize the draft board based on settings. |
| 🚀 | **Auto Draft** | Instantly complete the draft using AI. |
| ➡️ | **Next Pick** | Let AI make the next single selection. |
| 👆 | **Manual Pick** | Open search window to pick a specific player. |
| ↩️ | **Undo** | Revert the last selection. |
| 💾 | **Export** | Download the final team rosters. |
| 🔄 | **Reset** | Reset draft progress (keeps settings). |
| 🗑️ | **Clear** | Clear all cached data and reload page. |

### ⚡ Workflow Overview

1.  **Data Prep** 📝 : Download Template → Fill Data → Upload File.
2.  **Setup** ⚙️ : Set Teams/Players/Scores → Click **Load**.
3.  **Drafting** 🎲 : Use **Auto Draft** or **Manual Pick** until full.
4.  **Refining** 🔧 : Drag & Drop to swap players if needed.
5.  **Export** 📤 : Click **Export Results** to save file.

---

<a name="chinese"></a>
## 🇹🇼 中文說明

**ViperDraft** 是一個基於 React 與 Vite 開發的網頁版選秀模擬工具，專為需要平衡隊伍實力（如遊戲競賽、分組活動）的場景設計。它結合了 **S 型選秀 (Snake Draft)** 順序與 **Softmax 加權隨機演算法**，並具備智慧型的防死鎖機制，確保每支隊伍都能在分數限制內完成組隊。

> **🚀 立即體驗！** 點擊上方的 **Online Demo** 徽章，無需安裝即可直接在瀏覽器中開始使用。

### ✨ 主要功能

#### 核心選秀機制
*   **S 型選秀順序**：確保選秀順位公平，首輪最後選的隊伍將在次輪最先選。
*   **智慧自動選秀**：
    *   使用 **Softmax 加權隨機** 演算法，在符合條件的隊員中進行機率性選擇。
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
    *   **風險分析**：顯示隊員選擇風險（✅ 安全、⚠️ 風險、❌ 分數不符），並支援滑鼠懸停查看詳細說明 (Tooltip)。
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
    *   自動讀取 `team` (隊長/隊名)、`name` (姓名)、`score` (分數) 欄位。
    *   提供 **標準範本下載** 功能。
    *   **名單預覽**：可直接在介面上預覽匯入的資料。
    *   **智慧驗證**：自動偵測標題列、過濾無效資料 (分數 ≤ 0)、並檢查 **重複姓名**。
*   **資料持久化 (Persistence)**：
    *   所有設定、名單、選秀進度皆自動儲存於瀏覽器 **LocalStorage**。
    *   重新整理頁面後可無縫接續操作。
    *   **自動修復機制**：偵測資料損毀時自動重置並提示。

#### 選秀後管理
*   **隊員交換**：
    *   支援 **拖曳交換 (Drag & Drop)**：直覺地將隊員拖至另一隊進行交換。
    *   支援 **點擊交換**：點擊兩名隊員進行互換。
    *   拖曳時支援視窗邊緣自動捲動。
*   **上一步 (Undo)**：可隨時回溯上一次的選擇。
*   **結果匯出**：將最終分組結果匯出為 Excel 檔案。
    *   **自訂選項**：可勾選是否要在匯出檔案中包含隊員分數。

### 🚀 快速開始 (Getting Started)

您可以選擇直接使用線上版，或是下載原始碼在本地執行。

#### 方法一：線上版 (推薦)
無需安裝，點擊下方連結即可直接在瀏覽器中使用。
*   **👉 開啟 ViperDraft 線上版**

#### 方法二：本地安裝 (開發者)
如果您需要離線使用或進行開發：

1.  **前置需求**：Node.js (v16+) 與 npm/yarn。
2.  **安裝依賴**：`npm install`
3.  **啟動伺服器**：`npm run dev`
4.  **建置版本**：`npm run build`

### 📖 使用教學

進入應用程式後（無論是線上版或本地版）：

1.  **準備資料**：建立一個 Excel 檔案 (`.xlsx`)。
    *   **必要欄位**：`name` (姓名)、`score` (分數)。
    *   **選填欄位**：`team` (隊長/隊名，若填寫將自動設為該隊名稱)。
    *   *小撇步：您可以直接從控制面板下載標準範本。*
2.  **設定與載入**：
    *   上傳您的 Excel 檔案。
    *   設定 **隊伍數量**、**每隊人數** 以及 **分數上下限**。
    *   點擊 **載入** 初始化選秀看板。
3.  **進行選秀**：
    *   **自動選秀**：一鍵由 AI 演算法瞬間完成所有選擇。
    *   **手動選人**：點擊「手動選人」可搜尋並指定特定球員。
4.  **調整與匯出**：
    *   選秀結束後，可透過拖曳或點擊來交換隊員。
    *   點擊 **匯出結果** 下載最終名單。

### 🕹️ 按鍵功能說明

| 圖示 | 按鈕名稱 | 功能描述 |
| :---: | :--- | :--- |
| 📂 | **選擇檔案** | 上傳您的球員名單 Excel 檔。 |
| 📥 | **範本** | 下載標準格式範本，方便填寫。 |
| 👀 | **預覽** | 檢視目前程式讀取到的名單資料。 |
| 📥 | **載入** | 鎖定設定並初始化選秀看板。 |
| 🚀 | **自動選秀** | 由 AI 瞬間完成剩餘的所有選秀。 |
| ➡️ | **下一步** | 由 AI 自動幫當前隊伍選一人。 |
| 👆 | **手動選人** | 開啟搜尋視窗，指定特定球員。 |
| ↩️ | **上一步** | 復原上一次的選擇操作。 |
| 💾 | **匯出結果** | 將最終分組名單下載為 Excel。 |
| 🔄 | **重置** | 清空選秀進度，回到初始狀態。 |
| 🗑️ | **清除** | 強制清除所有暫存並重新整理頁面。 |

### ⚡ 快速流程表

1.  **準備資料** 📝：下載範本 → 填寫名單 → 上傳檔案。
2.  **初始設定** ⚙️：調整隊伍數、人數、分數上下限 → 點擊 **「載入」**。
3.  **進行選秀** 🎲：使用 **「自動選秀」** (快速) 或 **「手動選人」** (精準)。
4.  **戰力調整** 🔧：選秀結束後，可拖曳或點擊交換隊員。
5.  **存檔匯出** 📤：點擊 **「匯出結果」** 保存最終名單。

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