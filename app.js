(function () {
    "use strict";

    // ===== ローカルストレージキー =====
    const LS_STATS = "vocab_card_quiz_stats_v1";
    const LS_NG = "vocab_card_quiz_ng_v1";
    const LS_DIR = "vocab_card_quiz_direction_v1";
    const LS_CHOICE_MODE = "vocab_card_quiz_choice_mode_v1";

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
    let activeKey = "ch1";
    let direction = loadDirection();        // forward / reverse / mixed
    let choiceMode = loadChoiceMode();      // auto / term / def
    let isNgMode = false;

    // 問題配列（動的生成）
    let questions = [];
    let order = [];
    let idx = 0;
    let answered = false;

    // 成績（章ごと）
    let stats = loadStats();
    // NG（章ごと：qid を保持）
    let ng = loadNg();

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

        ng[activeKey] ||= {};

        if (choiceIndex === q.answerIndex) {
            s.correct++;
            clickedEl.classList.add("correct");

            if (ng[activeKey][q.qid]) {
                delete ng[activeKey][q.qid];
                saveNg();

                if (isNgMode) {
                    const wasLast = (idx === order.length - 1);
                    buildOrder();
                    if (order.length === 0) {
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
            questions = [];
            order = [];
            idx = 0;
            render();
            return;
        }

        activeKey = key;
        idx = 0;
        buildQuestions();
        buildOrder();
        render();
    }

    function next() {
        if (!order.length) return;
        if (idx < order.length - 1) {
            idx++;
            render();
        } else {
            alert("この章は全問終了です。");
        }
    }

    function prev() {
        if (!order.length) return;
        if (idx > 0) {
            idx--;
            render();
        }
    }

    function restart() {
        idx = 0;
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

        saveStats();
        saveNg();

        isNgMode = false;
        idx = 0;
        buildQuestions();
        buildOrder();
        render();
    }

    // ===== イベント =====
    $chapter.addEventListener("change", (e) => setChapter(e.target.value));

    $direction.addEventListener("change", (e) => {
        direction = e.target.value;
        saveDirection();
        idx = 0;
        buildQuestions();
        buildOrder();
        render();
    });

    $choiceMode.addEventListener("change", (e) => {
        choiceMode = e.target.value;
        saveChoiceMode();
        idx = 0;
        buildQuestions();
        buildOrder();
        render();
    });

    $shuffle.addEventListener("click", shuffleOrder);

    $ngMode.addEventListener("click", () => {
        isNgMode = true;
        idx = 0;
        buildOrder();
        render();
    });

    $allMode.addEventListener("click", () => {
        isNgMode = false;
        idx = 0;
        buildOrder();
        render();
    });

    $next.addEventListener("click", next);
    $prev.addEventListener("click", prev);
    $restart.addEventListener("click", restart);
    $resetStats.addEventListener("click", resetAllStats);

    // ===== 初期化 =====
    // index.html の selected と合わせるならここを "ch2" のままでOK
    $chapter.value = activeKey;
    $direction.value = direction;
    $choiceMode.value = choiceMode;

    buildQuestions();
    buildOrder();
    render();
})();