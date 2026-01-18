export const DraftLogic = {
    // 產生 S 型選秀順序
    generateDraftOrder: (teamsCount, teammatesPerTeam) => {
        let order = [];
        for (let round = 0; round < teammatesPerTeam; round++) {
            let roundOrder = Array.from({ length: teamsCount }, (_, i) => i);
            if (round % 2 !== 0) {
                roundOrder.reverse();
            }
            order = order.concat(roundOrder);
        }
        return order;
    },

    // Softmax 加權隨機選擇
    weightedChoiceSoftmax: (candidates, temperature = 1.5) => {
        if (!candidates || candidates.length === 0) return null;
        
        const scores = candidates.map(p => p.score);
        const maxScore = Math.max(...scores);
        
        // 計算權重
        const expScores = scores.map(s => Math.exp((s - maxScore) / temperature));
        const totalWeight = expScores.reduce((a, b) => a + b, 0);
        
        let r = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < candidates.length; i++) {
            cumulative += expScores[i] / totalWeight;
            if (r < cumulative) {
                return candidates[i];
            }
        }
        
        return candidates[candidates.length - 1];
    },

    // 檢查單一隊伍是否能完成組隊 (使用已排序的分數陣列進行效能優化)
    canCompleteTeam: (slots, minScore, maxScore, sortedScores) => {
        if (slots === 0) return minScore <= 0 && 0 <= maxScore;
        if (sortedScores.length < slots) return false;

        // 快速範圍檢查
        // 最小可能總分 (選最小的 k 個)
        let minPossible = 0;
        for (let i = 0; i < slots; i++) minPossible += sortedScores[i];
        if (minPossible > maxScore) return false;

        // 最大可能總分 (選最大的 k 個)
        let maxPossible = 0;
        for (let i = 0; i < slots; i++) maxPossible += sortedScores[sortedScores.length - 1 - i];
        if (maxPossible < minScore) return false;

        // 如果只剩一格，需要精確檢查區間內是否有值
        if (slots === 1) {
            // 因為已排序，可以用 find 快速找
            const candidate = sortedScores.find(s => s >= minScore);
            return candidate !== undefined && candidate <= maxScore;
        }

        return true;
    },

    // 輔助函式：從排序陣列中移除一個分數 (回傳新陣列)
    removeScoreFromSorted: (sortedScores, scoreToRemove) => {
        const index = sortedScores.indexOf(scoreToRemove);
        if (index === -1) return sortedScores;
        const newScores = sortedScores.slice();
        newScores.splice(index, 1);
        return newScores;
    },

    // 檢查選擇某球員後，該隊伍未來是否還有活路 (自身可行性)
    checkFutureFeasibility: (team, candidatePick, sortedScores, settings, teammatesPerTeam) => {
        const currentRoster = team.roster || [];
        const remainingSlots = teammatesPerTeam - currentRoster.length - 1; // -1 是因為包含了 candidatePick
        const currentScore = (team.score || 0) + candidatePick.score;

        if (remainingSlots === 0) {
            return currentScore >= settings.minScore && currentScore <= settings.maxScore;
        }

        const minNeeded = settings.minScore - currentScore;
        const maxAllowed = settings.maxScore - currentScore;
        
        // 模擬移除該球員後的剩餘分數池
        const nextSortedScores = DraftLogic.removeScoreFromSorted(sortedScores, candidatePick.score);

        return DraftLogic.canCompleteTeam(remainingSlots, minNeeded, maxAllowed, nextSortedScores);
    },

    // 檢查全局可行性 (是否會害死其他隊伍) - 這是防止死鎖的關鍵
    checkGlobalFeasibility: (pickingTeamIndex, candidatePick, sortedScores, teams, settings, teammatesPerTeam) => {
        const nextSortedScores = DraftLogic.removeScoreFromSorted(sortedScores, candidatePick.score);

        for (let i = 0; i < teams.length; i++) {
            if (i === pickingTeamIndex) continue;

            const team = teams[i];
            const remainingSlots = teammatesPerTeam - team.roster.length;
            if (remainingSlots <= 0) continue;

            const minNeeded = settings.minScore - team.score;
            const maxAllowed = settings.maxScore - team.score;

            if (!DraftLogic.canCompleteTeam(remainingSlots, minNeeded, maxAllowed, nextSortedScores)) {
                return false; // 這個選擇會導致隊伍 i 無法完成
            }
        }
        return true;
    },

    // 獲取智慧過濾後的合法球員名單
    getSmartValidPlayers: (teamIndex, teams, availablePlayers, settings, teammatesPerTeam) => {
        const team = teams[teamIndex];
        const remainingSlots = teammatesPerTeam - team.roster.length;
        const remainingScoreMax = settings.maxScore - team.score;
        const remainingScoreMin = settings.minScore - team.score;

        // 預先排序分數，供後續檢查使用 (效能關鍵)
        const sortedScores = availablePlayers.map(p => p.score).sort((a, b) => a - b);

        // 1. 基礎過濾：分數不能爆表
        let validPlayers = availablePlayers.filter(p => p.score <= remainingScoreMax);

        if (validPlayers.length === 0) {
            return { valid: [], error: "沒有球員分數低於剩餘上限" };
        }

        // 2. 最後一選的特殊檢查
        if (remainingSlots === 1) {
            const finalValid = validPlayers.filter(p => p.score >= remainingScoreMin);
            if (finalValid.length === 0) {
                return { valid: [], error: "最後一選無法達到最低分數要求" };
            }
            return { valid: finalValid, error: null };
        }

        // 3. 進階可行性檢查 (Smart Check)
        const smartValid = [];
        for (const player of validPlayers) {
            // 檢查自身
            if (!DraftLogic.checkFutureFeasibility(team, player, sortedScores, settings, teammatesPerTeam)) {
                continue;
            }
            // 檢查全局 (避免死鎖)
            if (!DraftLogic.checkGlobalFeasibility(teamIndex, player, sortedScores, teams, settings, teammatesPerTeam)) {
                continue;
            }
            smartValid.push(player);
        }

        if (smartValid.length === 0) {
            // 如果沒有「完美選擇」(既利己又不害人)，則退回「僅利己」的選擇
            // 這樣至少能保證當前隊伍能走下去，雖然可能導致後續其他隊伍出問題，但比直接報錯好
            const selfFeasible = validPlayers.filter(p => 
                DraftLogic.checkFutureFeasibility(team, p, sortedScores, settings, teammatesPerTeam)
            );
            
            if (selfFeasible.length > 0) {
                return { valid: selfFeasible, error: "警告：無完美選擇，僅確保自身可行 (可能導致全局死鎖)" };
            }
            return { valid: [], error: "無可行選擇 (自身無法完成)" };
        }

        return { valid: smartValid, error: null };
    },

    // 風險分析 (用於手動選人)
    analyzeRisk: (teamIndex, player, availablePlayers, teams, settings, teammatesPerTeam) => {
        const sortedScores = availablePlayers.map(p => p.score).sort((a, b) => a - b);
        
        const team = teams[teamIndex];
        const remainingSlots = teammatesPerTeam - team.roster.length;
        const currentScore = team.score;
        const remainingMax = settings.maxScore - currentScore;
        const remainingMin = settings.minScore - currentScore;

        if (player.score > remainingMax) return { status: "❌", description: "分數過高", level: 5 };
        if (remainingSlots === 1 && player.score < remainingMin) return { status: "❌", description: "分數不足", level: 5 };

        const isSafeSelf = DraftLogic.checkFutureFeasibility(team, player, sortedScores, settings, teammatesPerTeam);
        
        // 只有當隊伍已經有人時才檢查全局 (效能考量)
        let isSafeGlobal = true;
        if (team.roster.length >= 1) {
            isSafeGlobal = DraftLogic.checkGlobalFeasibility(teamIndex, player, sortedScores, teams, settings, teammatesPerTeam);
        }

        if (isSafeSelf && isSafeGlobal) return { status: "✅", description: "安全", level: 1 };
        if (!isSafeSelf && !isSafeGlobal) return { status: "⚠️", description: "高風險 (全局+自身)", level: 4 };
        if (!isSafeGlobal) return { status: "⚠️", description: "全局風險", level: 3 };
        if (!isSafeSelf) return { status: "⚠️", description: "自身風險", level: 2 };

        return { status: "❔", description: "未知", level: 99 };
    }
};