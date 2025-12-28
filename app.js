(function () {
    "use strict";

    // ===== ローカルストレージキー =====
    const LS_STATS = "vocab_card_quiz_stats_v1";
    const LS_NG = "vocab_card_quiz_ng_v1";
    const LS_DIR = "vocab_card_quiz_direction_v1";
    const LS_CHOICE_MODE = "vocab_card_quiz_choice_mode_v1";

    // ★追加：前回選んだ章を復元
    const LS_CHAPTER = "vocab_card_quiz_chapter_v1";

    // ★追加：成績履歴
    const LS_HISTORY = "vocab_card_quiz_history_v1";

    // ===== カードデータ（章別）=====
    // ※ index.html の <option value="chX"> と完全一致させる
    const chapters = {
        ch1: { name: "1章", cards: (window.CARDS_CH1 || []).slice() },
        ch2: { name: "2章", cards: (window.CARDS_CH2 || []).slice() },
        ch3: { name: "3章", cards: (window.CARDS_CH3 || []).slice() },
        ch4: { name: "4章", cards: (window.CARDS_CH4 || []).slice() },
        ch5: { name: "5章", cards: (window.CARDS_CH5 || []).slice() },
        ch6: { name: "6章", cards: (window.CARDS_CH6 || []).slice() },
        ch7: { name: "7章", cards: (window.CARDS_CH7 || []).slice() },
        ch8: { name: "8章", cards: (window.CARDS_CH8 || []).slice() },
        ch9: { name: "9章", cards: (window.CARDS_CH9 || []).slice() },
        ch10: { name: "10章", cards: (window.CARDS_CH10 || []).slice() },
        ch11: { name: "11章", cards: (window.CARDS_CH11 || []).slice() },
        ch12: { name: "12章", cards: (window.CARDS_CH12 || []).slice() },
        ch13: { name: "13章", cards: (window.CARDS_CH13 || []).slice() },
        ch14: { name: "14章", cards: (window.CARDS_CH14 || []).slice() },
        ch15: { name: "15章", cards: (window.CARDS_CH15 || []).slice() },
        ch16: { name: "16章", cards: (window.CARDS_CH16 || []).slice() },
        ch17: { name: "17章", cards: (window.CARDS_CH17 || []).slice() },
        ch18: { name: "18章", cards: (window.CARDS_CH18 || []).slice() },
        ch19: { name: "19章", cards: (window.CARDS_CH19 || []).slice() },
        ch20: { name: "20章", cards: (window.CARDS_CH20 || []).slice() },
        ch21: { name: "21章", cards: (window.CARDS_CH21 || []).slice() },
    };

    // ===== 状態 =====
    let activeKey = loadChapter() || "ch1";
    let direction = loadDirection();        // forward / reverse / mixed
    let choiceMode = loadChoiceMode();      // auto / term / def
    let isNgMode = false;

    // 問題配列（動的生成）
    let questions = [];
    let order = [];
    let idx = 0;
    let answered = false;

    // 成績（章ごと：累計）
    let stats = loadStats();
    // NG（章ごと：qid を保持）
    let ng = loadNg();

    // ★追加：セッション（この「一周」の正答/総数）
    let session = {
        startedAt: Date.now(),
        correct: 0,
        total: 0,
        chapterKey: activeKey,
        direction: direction,
        choiceMode: choiceMode,
        isNgMode: isNgMode
    };

    // ★追加：履歴（配列）
    let history = loadHistory();

    // ===== DOM =====
    const $chapter = document.getElementById("chapter");
    const $direction = document.getElementById("direction");
    const $choiceMode = document.getElementById("choiceMode");
    const $shuffle = document.getElementById("shuffle");
    const $ngMode = document.getElementById("ngMode");
    const $allMode = document.getElementById("allMode");
    const $modeLabel = document.getElementById("modeLabel");
    const $metaPill = document.getElementById("metaPill");
    const $dataWarn = document.getElementById("dataWarn");

    const $question = document.getElementById("question");
    const $choices = document.getElementById("choices");
    const $explain = document.getElementById("explain");
    const $progress = document.getElementById("progress");
    const $score = document.getElementById("score");

    const $prev = document.getElementById("prev");
    const $next = document.getElementById("next");
    const $restart = document.getElementById("restart");
    const $resetStats = document.getElementById("resetStats");

    // ===== 追加UI（履歴/CSV/グラフ）=====
    const $historyBtn = document.getElementById("history");
    const $exportCsvBtn = document.getElementById("exportCsv");
    const $showGraphBtn = document.getElementById("showGraph");

    const $historyModal = document.getElementById("historyModal");
    const $closeHistory = document.getElementById("closeHistory");
    const $historyBody = document.getElementById("historyBody");
    const $historyHint = document.getElementById("historyHint");

    const $graphModal = document.getElementById("graphModal");
    const $closeGraph = document.getElementById("closeGraph");
    const $graphChapter = document.getElementById("graphChapter");
    const $rateChart = document.getElementById("rateChart");
    const $graphHint = document.getElementById("graphHint");

    // ===== Utility =====
    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function normalize(s) {
        return String(s ?? "")
            .replace(/\r\n/g, "\n")
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function hasText(s) {
        return normalize(s).length > 0;
    }

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function pad2(n) {
        return String(n).padStart(2, "0");
    }

    function formatDateTime(ts) {
        const d = new Date(ts);
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }

    function percent(correct, total) {
        return total ? Math.round((correct / total) * 100) : 0;
    }

    // ===== 設定ロード/セーブ =====
    function loadChapter() {
        const v = localStorage.getItem(LS_CHAPTER);
        return (v && chapters[v]) ? v : null;
    }
    function saveChapter() {
        localStorage.setItem(LS_CHAPTER, activeKey);
    }

    function loadDirection() {
        const v = localStorage.getItem(LS_DIR);
        return (v === "forward" || v === "reverse" || v === "mixed") ? v : "forward";
    }
    function saveDirection() {
        localStorage.setItem(LS_DIR, direction);
    }

    function loadChoiceMode() {
        const v = localStorage.getItem(LS_CHOICE_MODE);
        return (v === "auto" || v === "term" || v === "def") ? v : "auto";
    }
    function saveChoiceMode() {
        localStorage.setItem(LS_CHOICE_MODE, choiceMode);
    }

    function loadStats() {
        try {
            const raw = localStorage.getItem(LS_STATS);
            const base = raw ? JSON.parse(raw) : {};
            for (const k of Object.keys(chapters)) base[k] ??= { correct: 0, total: 0 };
            return base;
        } catch {
            const base = {};
            for (const k of Object.keys(chapters)) base[k] = { correct: 0, total: 0 };
            return base;
        }
    }
    function saveStats() {
        localStorage.setItem(LS_STATS, JSON.stringify(stats));
    }

    function loadNg() {
        try {
            const raw = localStorage.getItem(LS_NG);
            const base = raw ? JSON.parse(raw) : {};
            for (const k of Object.keys(chapters)) base[k] ??= {};
            return base;
        } catch {
            const base = {};
            for (const k of Object.keys(chapters)) base[k] = {};
            return base;
        }
    }
    function saveNg() {
        localStorage.setItem(LS_NG, JSON.stringify(ng));
    }

    // ★追加：履歴ロード/セーブ
    function loadHistory() {
        try {
            const raw = localStorage.getItem(LS_HISTORY);
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    }
    function saveHistory() {
        // 大きくなりすぎないように上限（例：2000件）
        if (history.length > 2000) history = history.slice(history.length - 2000);
        localStorage.setItem(LS_HISTORY, JSON.stringify(history));
    }

    // qid: 章 + 出題タイプ + cardId
    function makeQid(chKey, type, cardId) {
        return `${chKey}:${type}:${cardId}`;
    }

    // choiceMode=auto の場合：順→definition / 逆→term
    function resolvedChoiceMode(qType) {
        if (choiceMode === "auto") {
            return (qType === "forward") ? "def" : "term";
        }
        return choiceMode;
    }

    // ===== セッション管理（履歴）=====
    function resetSession(reason) {
        // reason はログ用途。リセット自体は静かに行う
        session = {
            startedAt: Date.now(),
            correct: 0,
            total: 0,
            chapterKey: activeKey,
            direction: direction,
            choiceMode: choiceMode,
            isNgMode: isNgMode,
            reason: reason || "reset"
        };
    }

    function logSession(reason) {
        // 0問のセッションは保存しない
        if (!session.total) return;

        const endedAt = Date.now();
        const ch = chapters[activeKey];
        const item = {
            id: `${endedAt}-${Math.random().toString(16).slice(2)}`,
            startedAt: session.startedAt,
            endedAt: endedAt,
            chapterKey: activeKey,
            chapterName: ch ? ch.name : activeKey,
            mode: isNgMode ? "ng" : "all",
            direction: direction,
            choiceMode: choiceMode,
            correct: session.correct,
            total: session.total,
            rate: percent(session.correct, session.total),
            reason: reason || "done"
        };

        history.push(item);
        saveHistory();
        // 次のセッションへ
        resetSession("after-log");
    }

    // ===== 問題生成（カード→四択） =====
    function buildQuestions() {
        const ch = chapters[activeKey];

        // ★保険：定義が無いキーを選ばれても落ちない
        if (!ch) {
            questions = [];
            order = [];
            $dataWarn.textContent = `章定義がありません：${activeKey}`;
            return;
        }

        const cards = ch.cards || [];
        const valid = cards.filter(c => hasText(c.term) && hasText(c.definition));
        const missing = cards.length - valid.length;

        $dataWarn.textContent = missing > 0 ? `データ注意：term/definition不足 ${missing}件` : "";

        const list = [];
        for (const c of valid) {
            if (direction === "forward") {
                list.push(makeForwardQuestion(activeKey, c));
            } else if (direction === "reverse") {
                list.push(makeReverseQuestion(activeKey, c));
            } else {
                list.push(makeForwardQuestion(activeKey, c));
                list.push(makeReverseQuestion(activeKey, c));
            }
        }
        questions = list;
    }

    function pickDistractors(cards, correctCardId, field, count) {
        const pool = cards
            .filter(c => c.id !== correctCardId)
            .map(c => normalize(c[field]))
            .filter(Boolean);

        shuffleArray(pool);

        const uniq = [];
        for (const x of pool) {
            if (!uniq.includes(x)) uniq.push(x);
            if (uniq.length >= count) break;
        }
        return uniq;
    }

    function makeForwardQuestion(chKey, card) {
        const ch = chapters[chKey];
        const cards = (ch.cards || []).filter(c => hasText(c.term) && hasText(c.definition));
        const mode = resolvedChoiceMode("forward");

        const prompt = (mode === "def")
            ? `次の用語の説明として最も適切なものはどれか。\n\n用語：${normalize(card.term)}`
            : `次の説明に該当する用語はどれか。\n\n${normalize(card.definition)}`;

        const correct = (mode === "def") ? normalize(card.definition) : normalize(card.term);
        const distractors = pickDistractors(cards, card.id, (mode === "def") ? "definition" : "term", 3);
        const choices = shuffleArray([correct, ...distractors]);
        const answerIndex = choices.indexOf(correct);

        return {
            qid: makeQid(chKey, `forward-${mode}`, card.id),
            type: "forward",
            cardId: card.id,
            chapterKey: chKey,
            prompt,
            choices,
            answerIndex: answerIndex >= 0 ? answerIndex : 0,
            explain: `正解：${normalize(card.term)}\n\n定義：${normalize(card.definition)}`
        };
    }

    function makeReverseQuestion(chKey, card) {
        const ch = chapters[chKey];
        const cards = (ch.cards || []).filter(c => hasText(c.term) && hasText(c.definition));
        const mode = resolvedChoiceMode("reverse");

        const prompt = (mode === "term")
            ? `次の説明に該当する用語はどれか。\n\n${normalize(card.definition)}`
            : `次の用語の説明として最も適切なものはどれか。\n\n用語：${normalize(card.term)}`;

        const correct = (mode === "term") ? normalize(card.term) : normalize(card.definition);
        const distractors = pickDistractors(cards, card.id, (mode === "term") ? "term" : "definition", 3);
        const choices = shuffleArray([correct, ...distractors]);
        const answerIndex = choices.indexOf(correct);

        return {
            qid: makeQid(chKey, `reverse-${mode}`, card.id),
            type: "reverse",
            cardId: card.id,
            chapterKey: chKey,
            prompt,
            choices,
            answerIndex: answerIndex >= 0 ? answerIndex : 0,
            explain: `正解：${normalize(card.term)}\n\n定義：${normalize(card.definition)}`
        };
    }

    function buildOrder() {
        const all = questions.map((_, i) => i);

        if (!isNgMode) {
            order = all;
            return;
        }

        const ngMap = ng[activeKey] || {};
        order = all.filter(i => ngMap[questions[i].qid] === true);
    }

    function currentQ() {
        if (!order.length) return null;
        return questions[order[idx]] || null;
    }

    // ===== 表示 =====
    function render() {
        answered = false;
        $choices.innerHTML = "";
        $explain.textContent = "";

        const ch = chapters[activeKey];

        // ★保険：章定義が無いならメッセージだけ出す
        if (!ch) {
            $question.textContent = `章定義がありません：${activeKey}\napp.js の chapters と index.html の option value を一致させてください。`;
            $progress.textContent = "";
            $score.textContent = "";
            return;
        }

        $modeLabel.textContent = isNgMode ? "（NGのみ復習）" : "（全問）";
        $metaPill.textContent = `章：${ch.name} / 出題：${labelDirection(direction)} / 選択肢：${labelChoiceMode(choiceMode)}`;

        if (questions.length === 0) {
            $question.textContent = "この章のカードデータがありません。";
            $progress.textContent = "";
            $score.textContent = formatScore(activeKey);
            return;
        }

        if (isNgMode && order.length === 0) {
            $question.textContent = "この章の「間違えた問題」はありません。";
            $progress.textContent = `${ch.name}：0 / 0`;
            $score.textContent = formatScore(activeKey);
            return;
        }

        const q = currentQ();
        if (!q) {
            $question.textContent = "出題できる問題がありません。";
            $progress.textContent = "";
            $score.textContent = formatScore(activeKey);
            return;
        }

        $question.textContent = q.prompt;
        $progress.textContent = `${ch.name}：${idx + 1} / ${order.length}`;
        $score.textContent = formatScore(activeKey);

        q.choices.forEach((text, i) => {
            const div = document.createElement("div");
            div.className = "choice";
            div.textContent = text;
            div.addEventListener("click", () => answer(i, div));
            $choices.appendChild(div);
        });
    }

    function labelDirection(v) {
        if (v === "forward") return "順引き";
        if (v === "reverse") return "逆引き";
        return "ミックス";
    }

    function labelChoiceMode(v) {
        if (v === "term") return "用語で選ぶ";
        if (v === "def") return "定義で選ぶ";
        return "自動";
    }

    function formatScore(chKey) {
        const s = stats[chKey] || { correct: 0, total: 0 };
        const rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
        return `正答率: ${rate}%（${s.correct}/${s.total}）`;
    }

    // ===== 回答処理（NGのみ対応） =====
    function answer(choiceIndex, clickedEl) {
        if (answered) return;
        answered = true;

        const q = currentQ();
        if (!q) return;

        const all = document.querySelectorAll(".choice");
        const s = stats[activeKey] || (stats[activeKey] = { correct: 0, total: 0 });
        s.total++;

        // ★セッションも加算
        session.total++;

        ng[activeKey] ||= {};

        if (choiceIndex === q.answerIndex) {
            s.correct++;
            session.correct++;
            clickedEl.classList.add("correct");

            if (ng[activeKey][q.qid]) {
                delete ng[activeKey][q.qid];
                saveNg();

                if (isNgMode) {
                    const wasLast = (idx === order.length - 1);
                    buildOrder();

                    // NGを全部解消した瞬間に「セッション完了」として履歴保存
                    if (order.length === 0) {
                        logSession("NGを全て解消");
                        idx = 0;
                        saveStats();
                        render();
                        return;
                    }

                    if (idx >= order.length) idx = order.length - 1;
                    if (wasLast && idx < order.length - 1) idx = order.length - 1;
                }
            }
        } else {
            clickedEl.classList.add("wrong");
            all[q.answerIndex]?.classList.add("correct");
            ng[activeKey][q.qid] = true;
            saveNg();
        }

        saveStats();
        $explain.textContent = "解説:\n" + q.explain;
        $score.textContent = formatScore(activeKey);
    }

    // ===== 操作 =====
    function setChapter(key) {
        // ★未知キーを弾く（index と app の不一致対策）
        if (!chapters[key]) {
            $dataWarn.textContent = `章定義がありません：${key}`;
            activeKey = key;
            saveChapter();
            questions = [];
            order = [];
            idx = 0;
            resetSession("unknown-chapter");
            render();
            return;
        }

        // 章を変えたタイミングで、未保存のセッションがあれば履歴に残す（任意）
        // ただし誤タップで履歴が増えすぎないよう「1問以上」だけ保存
        if (session.total) logSession("章変更");

        activeKey = key;
        saveChapter();

        idx = 0;
        buildQuestions();
        buildOrder();

        resetSession("chapter-change");
        render();
    }

    function next() {
        if (!order.length) return;

        if (idx < order.length - 1) {
            idx++;
            render();
            return;
        }

        // 最終問題の次へ
        // 「未回答のまま」なら移動させない（誤ログ防止）
        if (!answered) {
            alert("まずこの問題に回答してください。");
            return;
        }

        // 全問終了：履歴に保存
        logSession("全問終了");
        alert("この章は全問終了です。");
    }

    function prev() {
        if (!order.length) return;
        if (idx > 0) {
            idx--;
            render();
        }
    }

    function restart() {
        // リスタート前にセッション保存（1問以上回答していれば）
        if (session.total) logSession("最初から（途中保存）");

        idx = 0;
        resetSession("restart");
        render();
    }

    function shuffleOrder() {
        if (!order.length) return;
        shuffleArray(order);
        idx = 0;
        render();
    }

    function resetAllStats() {
        if (!confirm("章ごとの成績とNG（間違えた問題）を全てリセットします。よろしいですか？")) return;

        for (const k of Object.keys(chapters)) stats[k] = { correct: 0, total: 0 };
        for (const k of Object.keys(chapters)) ng[k] = {};

        // ★履歴も消すならここを有効化（今は“履歴は残す”）
        // history = [];
        // saveHistory();

        saveStats();
        saveNg();

        isNgMode = false;
        idx = 0;
        buildQuestions();
        buildOrder();

        resetSession("reset-stats");
        render();
    }

    // ===== 履歴UI =====
    function openHistory() {
        renderHistoryTable();
        $historyModal.hidden = false;
    }

    function closeHistory() {
        $historyModal.hidden = true;
    }

    function renderHistoryTable() {
        const latest = history.slice().reverse().slice(0, 10);
        $historyBody.innerHTML = "";

        if (latest.length === 0) {
            $historyHint.textContent = "履歴がまだありません。章を1周（またはNGを全て解消）すると履歴が残ります。";
            return;
        }

        $historyHint.textContent = "※ 章を一周したタイミング／NGを全て解消したタイミングで履歴に保存します。";

        for (const h of latest) {
            const tr = document.createElement("tr");

            const cells = [
                formatDateTime(h.endedAt),
                h.chapterName || h.chapterKey,
                (h.mode === "ng") ? "NGのみ" : "全問",
                labelDirection(h.direction),
                labelChoiceMode(h.choiceMode),
                String(h.correct),
                String(h.total),
                `${h.rate}%`,
                h.reason || ""
            ];

            cells.forEach((txt, i) => {
                const td = document.createElement("td");
                td.textContent = txt;
                if (i === 8) td.className = "wrap";
                tr.appendChild(td);
            });

            $historyBody.appendChild(tr);
        }
    }

    // ===== CSVエクスポート =====
    function exportHistoryCsv() {
        if (!history.length) {
            alert("履歴がありません。");
            return;
        }

        const header = [
            "endedAt",
            "chapterKey",
            "chapterName",
            "mode",
            "direction",
            "choiceMode",
            "correct",
            "total",
            "rate",
            "reason"
        ];

        const rows = history.map(h => [
            formatDateTime(h.endedAt),
            h.chapterKey,
            h.chapterName || "",
            h.mode,
            h.direction,
            h.choiceMode,
            String(h.correct),
            String(h.total),
            String(h.rate),
            (h.reason || "").replace(/\r?\n/g, " ")
        ]);

        const csv = [header, ...rows]
            .map(cols => cols.map(csvEscape).join(","))
            .join("\r\n");

        // Excel 対策：UTF-8 BOM を付与
        const bom = "\uFEFF";
        const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `vocab_quiz_history_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    function csvEscape(v) {
        const s = String(v ?? "");
        if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
    }

    // ===== グラフUI =====
    function openGraph() {
        buildGraphChapterOptions();
        $graphModal.hidden = false;

        // 初期：履歴がある章（なければ activeKey）
        const first = $graphChapter.options.length ? $graphChapter.options[0].value : activeKey;
        $graphChapter.value = first;
        drawGraph(first);
    }

    function closeGraph() {
        $graphModal.hidden = true;
    }

    function buildGraphChapterOptions() {
        const has = new Set(history.map(h => h.chapterKey));
        $graphChapter.innerHTML = "";

        // 履歴がある章だけ
        const keys = Object.keys(chapters).filter(k => has.has(k));
        if (keys.length === 0) {
            // 0件でもUIが壊れないように activeKey を入れる（ただし描画は「履歴なし」になる）
            keys.push(activeKey);
        }

        for (const k of keys) {
            const opt = document.createElement("option");
            opt.value = k;
            opt.textContent = chapters[k] ? chapters[k].name : k;
            $graphChapter.appendChild(opt);
        }
    }

    function drawGraph(chKey) {
        const canvas = $rateChart;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 背景クリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const list = history.filter(h => h.chapterKey === chKey);

        if (list.length === 0) {
            ctx.font = "14px system-ui, sans-serif";
            ctx.fillText("この章の履歴がありません。", 16, 40);
            $graphHint.textContent = "履歴が増えると、ここに推移が表示されます。";
            return;
        }

        // 最新30件（表示しすぎると見づらい）
        const data = list.slice(-30);
        const rates = data.map(h => clamp(h.rate, 0, 100));

        $graphHint.textContent = `表示：最新 ${data.length} 件（1セッション= 章一周 / NG解消）  平均 ${avg(rates).toFixed(1)}%`;

        // 描画領域
        const padL = 48, padR = 16, padT = 16, padB = 30;
        const w = canvas.width - padL - padR;
        const h = canvas.height - padT - padB;

        // 軸
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, padT + h);
        ctx.lineTo(padL + w, padT + h);
        ctx.stroke();

        // Y目盛（0,25,50,75,100）
        ctx.fillStyle = "#111";
        ctx.font = "12px system-ui, sans-serif";
        const ticks = [0, 25, 50, 75, 100];
        for (const t of ticks) {
            const y = padT + h - (t / 100) * h;
            ctx.strokeStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(padL + w, y);
            ctx.stroke();

            ctx.fillStyle = "#111";
            ctx.fillText(`${t}%`, 8, y + 4);
        }

        // 線
        const n = rates.length;
        const stepX = (n <= 1) ? 0 : (w / (n - 1));

        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            const x = padL + stepX * i;
            const y = padT + h - (rates[i] / 100) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 点
        ctx.fillStyle = "#111";
        for (let i = 0; i < n; i++) {
            const x = padL + stepX * i;
            const y = padT + h - (rates[i] / 100) * h;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Xラベル（最初/最後）
        ctx.fillStyle = "#111";
        ctx.font = "11px system-ui, sans-serif";
        const firstTs = formatDateTime(data[0].endedAt);
        const lastTs = formatDateTime(data[data.length - 1].endedAt);
        ctx.fillText(firstTs, padL, padT + h + 22);
        const wLast = ctx.measureText(lastTs).width;
        ctx.fillText(lastTs, padL + w - wLast, padT + h + 22);
    }

    function avg(arr) {
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    // ===== イベント =====
    $chapter.addEventListener("change", (e) => setChapter(e.target.value));

    $direction.addEventListener("change", (e) => {
        // 変更前にセッション途中なら保存（任意）
        if (session.total) logSession("出題変更");

        direction = e.target.value;
        saveDirection();

        idx = 0;
        buildQuestions();
        buildOrder();

        resetSession("direction-change");
        render();
    });

    $choiceMode.addEventListener("change", (e) => {
        if (session.total) logSession("選択肢変更");

        choiceMode = e.target.value;
        saveChoiceMode();

        idx = 0;
        buildQuestions();
        buildOrder();

        resetSession("choiceMode-change");
        render();
    });

    $shuffle.addEventListener("click", shuffleOrder);

    $ngMode.addEventListener("click", () => {
        // モード変更前に保存（任意）
        if (session.total) logSession("NGモード切替");

        isNgMode = true;
        idx = 0;
        buildOrder();

        resetSession("ng-mode");
        render();
    });

    $allMode.addEventListener("click", () => {
        if (session.total) logSession("全問モード切替");

        isNgMode = false;
        idx = 0;
        buildOrder();

        resetSession("all-mode");
        render();
    });

    $next.addEventListener("click", next);
    $prev.addEventListener("click", prev);
    $restart.addEventListener("click", restart);
    $resetStats.addEventListener("click", resetAllStats);

    // 追加：履歴/CSV/グラフ
    if ($historyBtn) $historyBtn.addEventListener("click", openHistory);
    if ($closeHistory) $closeHistory.addEventListener("click", closeHistory);
    if ($historyModal) $historyModal.addEventListener("click", (e) => { if (e.target === $historyModal) closeHistory(); });

    if ($exportCsvBtn) $exportCsvBtn.addEventListener("click", exportHistoryCsv);

    if ($showGraphBtn) $showGraphBtn.addEventListener("click", openGraph);
    if ($closeGraph) $closeGraph.addEventListener("click", closeGraph);
    if ($graphModal) $graphModal.addEventListener("click", (e) => { if (e.target === $graphModal) closeGraph(); });
    if ($graphChapter) $graphChapter.addEventListener("change", (e) => drawGraph(e.target.value));

    // ===== 初期化 =====
    // index.html の selected より localStorage を優先して初期章を決める
    $chapter.value = chapters[activeKey] ? activeKey : "ch1";
    if (!chapters[activeKey]) activeKey = "ch1";

    $direction.value = direction;
    $choiceMode.value = choiceMode;

    saveChapter(); // 初回も保存しておく

    buildQuestions();
    buildOrder();

    resetSession("init");
    render();
})();