(function () {
  "use strict";

  // ==============================
  // 重要用語クイズ（カード式） app.js
  //  - 章/出題/選択肢モードの保存
  //  - NG復習
  //  - セッション履歴(最新10) / CSV / 簡易グラフ
  //  - 追加解説：タブ（例/ポイント/暗記/ひっかけ） + 折りたたみ（試験直前モード）
  // ==============================

  // ===== ローカルストレージキー =====
  const LS_STATS = "vocab_card_quiz_stats_v1";
  const LS_NG = "vocab_card_quiz_ng_v1";
  const LS_DIR = "vocab_card_quiz_direction_v1";
  const LS_CHOICE_MODE = "vocab_card_quiz_choice_mode_v1";
  const LS_CHAPTER = "vocab_card_quiz_chapter_v1";

  // 履歴/CSV/グラフ
  const LS_HISTORY = "vocab_card_quiz_session_history_v1";
  // 試験直前モード（追加解説折りたたみ）
  const LS_CRAM = "vocab_card_quiz_cram_mode_v1";

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
  let activeKey = loadChapter();
  if (!chapters[activeKey]) activeKey = "ch1";

  let direction = loadDirection(); // forward / reverse / mixed
  let choiceMode = loadChoiceMode(); // auto / term / def
  let isNgMode = false;
  let cramMode = loadCramMode();

  // 問題配列（動的生成）
  let questions = [];
  let order = [];
  let idx = 0;
  let answered = false;

  // 成績（章ごと）
  let stats = loadStats();
  // NG（章ごと：qid を保持）
  let ng = loadNg();

  // セッション（履歴用）
  let session = makeNewSession("init");

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

  // 追加UI（存在しない場合があるので必ずnull許容）
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

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hasText(s) {
    return normalize(s).length > 0;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function toJstString(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(iso);
    }
  }

  // ===== 保存/復元 =====
  function loadDirection() {
    const v = localStorage.getItem(LS_DIR);
    return v === "forward" || v === "reverse" || v === "mixed" ? v : "forward";
  }
  function saveDirection() {
    localStorage.setItem(LS_DIR, direction);
  }

  function loadChoiceMode() {
    const v = localStorage.getItem(LS_CHOICE_MODE);
    return v === "auto" || v === "term" || v === "def" ? v : "auto";
  }
  function saveChoiceMode() {
    localStorage.setItem(LS_CHOICE_MODE, choiceMode);
  }

  function loadChapter() {
    const v = localStorage.getItem(LS_CHAPTER);
    return v && /^ch\d+$/.test(v) ? v : "ch1";
  }
  function saveChapter() {
    localStorage.setItem(LS_CHAPTER, activeKey);
  }

  function loadCramMode() {
    const v = localStorage.getItem(LS_CRAM);
    return v === "1";
  }
  function saveCramMode() {
    localStorage.setItem(LS_CRAM, cramMode ? "1" : "0");
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

  function loadHistory() {
    try {
      const raw = localStorage.getItem(LS_HISTORY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function saveHistory(arr) {
    localStorage.setItem(LS_HISTORY, JSON.stringify(arr));
  }

  // ===== qid =====
  function makeQid(chKey, type, cardId) {
    return `${chKey}:${type}:${cardId}`;
  }

  // choiceMode=auto の場合：順→definition / 逆→term
  function resolvedChoiceMode(qType) {
    if (choiceMode === "auto") {
      return qType === "forward" ? "def" : "term";
    }
    return choiceMode;
  }

  // ===== 追加解説（パース + 表示） =====
  function parseExtraExplain(raw) {
    // 期待フォーマット例：
    // "ポイント: ...\nひっかけ: ...\n例: ...\n暗記: ..."
    const text = normalize(raw);
    if (!text) return { point: "", trap: "", example: "", memo: "" };

    const lines = text.split("\n");
    const out = { point: "", trap: "", example: "", memo: "" };
    let cur = "";

    const matchLabel = (line) => {
      const l = line.trim();
      // 半角: / 全角： の両対応
      const pairs = [
        { key: "point", re: /^(ポイント|Point)\s*[:：]\s*/i },
        { key: "trap", re: /^(ひっかけ|引っかけ|Trap)\s*[:：]\s*/i },
        { key: "example", re: /^(例|Example)\s*[:：]\s*/i },
        { key: "memo", re: /^(暗記|Memorize|Mnemonic)\s*[:：]\s*/i },
      ];
      for (const p of pairs) {
        if (p.re.test(l)) {
          const body = l.replace(p.re, "");
          return { key: p.key, body };
        }
      }
      return null;
    };

    for (const line of lines) {
      const hit = matchLabel(line);
      if (hit) {
        cur = hit.key;
        if (hit.body) out[cur] += (out[cur] ? "\n" : "") + hit.body;
        continue;
      }
      if (cur) {
        out[cur] += (out[cur] ? "\n" : "") + line;
      } else {
        // ラベル無し先頭はポイント扱い
        out.point += (out.point ? "\n" : "") + line;
      }
    }

    // 余計な「例: 例：」等が混ざっても二重にならないよう、先頭のラベルっぽいものを除去
    for (const k of Object.keys(out)) {
      out[k] = normalize(out[k]).replace(/^(ポイント|ひっかけ|引っかけ|例|暗記)\s*[:：]\s*/g, "");
    }

    return out;
  }

  function buildExplainHtml(card, q) {
    const term = escapeHtml(normalize(card.term));
    const def = escapeHtml(normalize(card.definition));
    const extra = parseExtraExplain(card.extraExplain);

    // タブ構成
    const tabs = [
      { id: "tab-point", label: "ポイント", key: "point" },
      { id: "tab-example", label: "例", key: "example" },
      { id: "tab-memo", label: "暗記", key: "memo" },
      { id: "tab-trap", label: "ひっかけ", key: "trap" },
    ];

    const hasAnyExtra = tabs.some(t => hasText(extra[t.key]));

    const tabButtons = tabs
      .map((t) => {
        const disabled = hasText(extra[t.key]) ? "" : "data-disabled=1";
        return `<button type="button" class="ex-tab" data-tab="${t.id}" ${disabled}>${t.label}</button>`;
      })
      .join("");

    const tabPanels = tabs
      .map((t) => {
        const body = hasText(extra[t.key]) ? escapeHtml(extra[t.key]).replace(/\n/g, "<br>") : "（未設定）";
        return `<div class="ex-panel" id="${t.id}" hidden>${body}</div>`;
      })
      .join("");

    const detailsOpen = cramMode ? "" : "open";

    // インラインCSS（index.htmlをいじらなくても崩れないため）
    const style = `
<style>
  .ex-top { display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .ex-kv { font-size: 13px; line-height: 1.6; }
  .ex-kv b { font-weight:700; }
  .ex-tabs { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 8px; }
  .ex-tab { border:1px solid #d1d5db; background:#fff; padding:6px 10px; border-radius:999px; cursor:pointer; font-size:12px; }
  .ex-tab[aria-selected="true"] { background:#111; color:#fff; border-color:#111; }
  .ex-tab[data-disabled="1"] { opacity:.45; cursor:not-allowed; }
  .ex-panel { border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; background:#f9fafb; font-size:13px; line-height:1.7; }
  .ex-mini { font-size:12px; color:#6b7280; }
  .ex-toggle { border:1px solid #d1d5db; background:#fff; padding:8px 10px; border-radius:12px; cursor:pointer; font-size:12px; }
</style>`;

    const header = `
<div class="ex-top">
  <div class="ex-mini">解説（タップで展開・切替）</div>
  <button type="button" class="ex-toggle" id="toggleCram">試験直前モード：${cramMode ? "ON（折りたたみ）" : "OFF（展開）"}</button>
</div>`;

    const kv = `
<div class="ex-kv">
  <div><b>正解：</b>${term}</div>
  <div><b>定義：</b>${def}</div>
</div>`;

    const extraBlock = hasAnyExtra
      ? `
<details ${detailsOpen}>
  <summary class="ex-mini">追加解説（例 / ポイント / 暗記 / ひっかけ）</summary>
  <div class="ex-tabs" role="tablist" aria-label="追加解説タブ">${tabButtons}</div>
  ${tabPanels}
  <div class="ex-mini" style="margin-top:8px;">※「未設定」はカードの extraExplain が未入力です</div>
</details>`
      : `
<details ${detailsOpen}>
  <summary class="ex-mini">追加解説（未設定）</summary>
  <div class="ex-mini" style="margin-top:8px;">このカードは extraExplain が未入力です。</div>
</details>`;

    // q は未使用だが将来拡張用
    return `${style}${header}${kv}${extraBlock}`;
  }

  function mountExplainInteractions() {
    // タブ：最初の有効タブを選択
    const tabs = Array.from($explain.querySelectorAll(".ex-tab"));
    const panels = Array.from($explain.querySelectorAll(".ex-panel"));

    const pickFirstEnabled = () => {
      return tabs.find(b => b.getAttribute("data-disabled") !== "1") || tabs[0];
    };

    const setActive = (btn) => {
      if (!btn || btn.getAttribute("data-disabled") === "1") return;
      const targetId = btn.getAttribute("data-tab");

      for (const b of tabs) b.setAttribute("aria-selected", String(b === btn));
      for (const p of panels) p.hidden = p.id !== targetId;
    };

    for (const b of tabs) {
      b.addEventListener("click", () => setActive(b));
    }

    const first = pickFirstEnabled();
    if (first) setActive(first);

    const $toggle = document.getElementById("toggleCram");
    if ($toggle) {
      $toggle.addEventListener("click", () => {
        cramMode = !cramMode;
        saveCramMode();
        // いま表示中の解説を再構築（answer後のqが必要なので currentQ から辿る）
        const q = currentQ();
        if (!q) return;
        const card = findCard(q.chapterKey, q.cardId);
        if (!card) return;
        $explain.innerHTML = buildExplainHtml(card, q);
        mountExplainInteractions();
      });
    }
  }

  function findCard(chKey, cardId) {
    const ch = chapters[chKey];
    if (!ch) return null;
    return (ch.cards || []).find(c => c.id === cardId) || null;
  }

  // ===== セッション =====
  function makeNewSession(reason) {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      startedAt: nowIso(),
      endedAt: null,
      chapterKey: activeKey,
      chapterName: chapters[activeKey]?.name ?? activeKey,
      mode: isNgMode ? "NG" : "ALL",
      direction,
      choiceMode,
      correct: 0,
      total: 0,
      reason: reason || "",
    };
  }

  function resetSession(reason) {
    session = makeNewSession(reason);
  }

  function logSession(reason) {
    if (!session || !session.total) {
      // 0問なら履歴に残さない
      resetSession(reason || "reset");
      return;
    }
    session.endedAt = nowIso();
    session.reason = reason || session.reason;
    session.chapterKey = activeKey;
    session.chapterName = chapters[activeKey]?.name ?? activeKey;
    session.mode = isNgMode ? "NG" : "ALL";
    session.direction = direction;
    session.choiceMode = choiceMode;

    const history = loadHistory();
    history.unshift(session);
    // 増えすぎ防止：最大200
    if (history.length > 200) history.length = 200;
    saveHistory(history);

    resetSession("after-log");
  }

  // ===== 問題生成（カード→四択） =====
  function buildQuestions() {
    const ch = chapters[activeKey];

    if (!ch) {
      questions = [];
      order = [];
      if ($dataWarn) $dataWarn.textContent = `章定義がありません：${activeKey}`;
      return;
    }

    const cards = ch.cards || [];
    const valid = cards.filter((c) => hasText(c.term) && hasText(c.definition));
    const missing = cards.length - valid.length;

    if ($dataWarn) $dataWarn.textContent = missing > 0 ? `データ注意：term/definition不足 ${missing}件` : "";

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
      .filter((c) => c.id !== correctCardId)
      .map((c) => normalize(c[field]))
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
    const cards = (ch.cards || []).filter((c) => hasText(c.term) && hasText(c.definition));
    const mode = resolvedChoiceMode("forward");

    const prompt =
      mode === "def"
        ? `次の用語の説明として最も適切なものはどれか。\n\n用語：${normalize(card.term)}`
        : `次の説明に該当する用語はどれか。\n\n${normalize(card.definition)}`;

    const correct = mode === "def" ? normalize(card.definition) : normalize(card.term);
    const distractors = pickDistractors(cards, card.id, mode === "def" ? "definition" : "term", 3);
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
    };
  }

  function makeReverseQuestion(chKey, card) {
    const ch = chapters[chKey];
    const cards = (ch.cards || []).filter((c) => hasText(c.term) && hasText(c.definition));
    const mode = resolvedChoiceMode("reverse");

    const prompt =
      mode === "term"
        ? `次の説明に該当する用語はどれか。\n\n${normalize(card.definition)}`
        : `次の用語の説明として最も適切なものはどれか。\n\n用語：${normalize(card.term)}`;

    const correct = mode === "term" ? normalize(card.term) : normalize(card.definition);
    const distractors = pickDistractors(cards, card.id, mode === "term" ? "term" : "definition", 3);
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
    };
  }

  function buildOrder() {
    const all = questions.map((_, i) => i);

    if (!isNgMode) {
      order = all;
      return;
    }

    const ngMap = ng[activeKey] || {};
    order = all.filter((i) => ngMap[questions[i].qid] === true);
  }

  function currentQ() {
    if (!order.length) return null;
    return questions[order[idx]] || null;
  }

  // ===== 表示 =====
  function render() {
    answered = false;
    if ($choices) $choices.innerHTML = "";
    if ($explain) $explain.innerHTML = "";

    const ch = chapters[activeKey];

    if (!ch) {
      if ($question) {
        $question.textContent = `章定義がありません：${activeKey}\napp.js の chapters と index.html の option value を一致させてください。`;
      }
      if ($progress) $progress.textContent = "";
      if ($score) $score.textContent = "";
      return;
    }

    if ($modeLabel) $modeLabel.textContent = isNgMode ? "（NGのみ復習）" : "（全問）";
    if ($metaPill) {
      $metaPill.textContent = `章：${ch.name} / 出題：${labelDirection(direction)} / 選択肢：${labelChoiceMode(choiceMode)}`;
    }

    if (questions.length === 0) {
      if ($question) $question.textContent = "この章のカードデータがありません。";
      if ($progress) $progress.textContent = "";
      if ($score) $score.textContent = formatScore(activeKey);
      return;
    }

    if (isNgMode && order.length === 0) {
      if ($question) $question.textContent = "この章の『間違えた問題』はありません。";
      if ($progress) $progress.textContent = `${ch.name}：0 / 0`;
      if ($score) $score.textContent = formatScore(activeKey);
      return;
    }

    const q = currentQ();
    if (!q) {
      if ($question) $question.textContent = "出題できる問題がありません。";
      if ($progress) $progress.textContent = "";
      if ($score) $score.textContent = formatScore(activeKey);
      return;
    }

    if ($question) $question.textContent = q.prompt;
    if ($progress) $progress.textContent = `${ch.name}：${idx + 1} / ${order.length}`;
    if ($score) $score.textContent = formatScore(activeKey);

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
          const wasLast = idx === order.length - 1;
          buildOrder();

          // NGを全て解消した瞬間に「セッション完了」として履歴保存
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

    // 解説表示（タブ + 折りたたみ）
    const card = findCard(q.chapterKey, q.cardId);
    if ($explain) {
      if (card) {
        $explain.innerHTML = buildExplainHtml(card, q);
        mountExplainInteractions();
      } else {
        $explain.textContent = "解説:（カード参照に失敗しました）";
      }
    }

    if ($score) $score.textContent = formatScore(activeKey);

    // 章の全問を解き切ったとき（最後の問題で回答した瞬間）も履歴に残す
    // ※「次へ」でアラートが出る前に保存
    if (!isNgMode && idx === order.length - 1) {
      logSession("全問の最後を回答");
    }
  }

  // ===== 操作 =====
  function setChapter(key) {
    if (!chapters[key]) {
      if ($dataWarn) $dataWarn.textContent = `章定義がありません：${key}`;
      activeKey = key;
      saveChapter();
      questions = [];
      order = [];
      idx = 0;
      resetSession("unknown-chapter");
      render();
      return;
    }

    // 章を変えたタイミングで、未保存のセッションがあれば履歴に残す（1問以上のみ）
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

    // 履歴もリセットするか？ → 今回は成績リセットに含めない（Excel提出用途のため）

    isNgMode = false;
    idx = 0;
    buildQuestions();
    buildOrder();

    resetSession("reset-stats");
    render();
  }

  // ===== 履歴UI =====
  function openHistory() {
    if (!$historyModal || !$historyBody) return;

    const history = loadHistory();
    const latest = history.slice(0, 10);

    if ($historyHint) {
      $historyHint.textContent = latest.length ? `保存件数：${history.length}（表示：最新10件）` : "まだ履歴がありません。";
    }

    $historyBody.innerHTML = latest
      .map((h) => {
        const rate = h.total ? Math.round((h.correct / h.total) * 100) : 0;
        return `
<tr>
  <td>${escapeHtml(toJstString(h.endedAt || h.startedAt))}</td>
  <td>${escapeHtml(h.chapterName || h.chapterKey)}</td>
  <td>${escapeHtml(h.mode || "")}</td>
  <td>${escapeHtml(labelDirection(h.direction))}</td>
  <td>${escapeHtml(labelChoiceMode(h.choiceMode))}</td>
  <td>${escapeHtml(String(h.correct))}</td>
  <td>${escapeHtml(String(h.total))}</td>
  <td>${escapeHtml(String(rate))}%</td>
  <td class="wrap">${escapeHtml(h.reason || "")}</td>
</tr>`;
      })
      .join("");

    $historyModal.hidden = false;
  }

  function closeHistory() {
    if ($historyModal) $historyModal.hidden = true;
  }

  // ===== CSV =====
  function exportCsv() {
    const history = loadHistory();
    if (!history.length) {
      alert("履歴がありません。まずは数問解いてください。");
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
      "reason",
    ];

    const rows = history.map((h) => {
      const rate = h.total ? Math.round((h.correct / h.total) * 100) : 0;
      const obj = {
        endedAt: h.endedAt || h.startedAt,
        chapterKey: h.chapterKey,
        chapterName: h.chapterName,
        mode: h.mode,
        direction: h.direction,
        choiceMode: h.choiceMode,
        correct: h.correct,
        total: h.total,
        rate: rate,
        reason: h.reason || "",
      };
      return header
        .map((k) => {
          const v = String(obj[k] ?? "");
          // CSVエスケープ
          const escaped = v.replace(/\"/g, '""');
          return `"${escaped}"`;
        })
        .join(",");
    });

    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_session_history.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  // ===== グラフ（Canvas簡易） =====
  function openGraph() {
    if (!$graphModal || !$graphChapter || !$rateChart) return;

    const history = loadHistory();
    // 章ごとに履歴抽出
    const byCh = {};
    for (const h of history) {
      if (!h.chapterKey) continue;
      (byCh[h.chapterKey] ||= []).push(h);
    }

    const keys = Object.keys(byCh).filter((k) => byCh[k].length);
    if (!keys.length) {
      alert("履歴がありません。まずは数問解いてください。");
      return;
    }

    // select再構築
    $graphChapter.innerHTML = keys
      .sort((a, b) => (a.localeCompare(b, "ja")))
      .map((k) => {
        const name = chapters[k]?.name || k;
        return `<option value="${escapeHtml(k)}">${escapeHtml(name)}</option>`;
      })
      .join("");

    const draw = () => {
      const chKey = $graphChapter.value;
      const list = (byCh[chKey] || []).slice().reverse(); // 古い→新しい
      drawRateChart($rateChart, list, chapters[chKey]?.name || chKey);

      if ($graphHint) {
        $graphHint.textContent = `表示：${chapters[chKey]?.name || chKey}（${list.length}セッション）`;
      }
    };

    $graphChapter.onchange = draw;
    draw();

    $graphModal.hidden = false;
  }

  function closeGraph() {
    if ($graphModal) $graphModal.hidden = true;
  }

  function drawRateChart(canvas, sessions, title) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // padding
    const padL = 40;
    const padR = 10;
    const padT = 20;
    const padB = 30;

    // axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, H - padB);
    ctx.lineTo(W - padR, H - padB);
    ctx.stroke();

    // title
    ctx.fillStyle = "#111";
    ctx.font = "12px system-ui, 'Noto Sans JP', sans-serif";
    ctx.fillText(`${title} 平均正答率（%）`, padL, 14);

    if (!sessions.length) {
      ctx.fillStyle = "#6b7280";
      ctx.fillText("履歴がありません", padL + 10, padT + 20);
      return;
    }

    // y grid (0,25,50,75,100)
    ctx.strokeStyle = "#e5e7eb";
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px system-ui, 'Noto Sans JP', sans-serif";
    for (const y of [0, 25, 50, 75, 100]) {
      const yy = mapY(y);
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(W - padR, yy);
      ctx.stroke();
      ctx.fillText(String(y), 6, yy + 3);
    }

    function mapX(i) {
      const n = Math.max(1, sessions.length - 1);
      const x0 = padL;
      const x1 = W - padR;
      return x0 + ((x1 - x0) * i) / n;
    }
    function mapY(rate) {
      const y0 = padT;
      const y1 = H - padB;
      return y1 - ((y1 - y0) * rate) / 100;
    }

    // line
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    sessions.forEach((s, i) => {
      const r = s.total ? (s.correct / s.total) * 100 : 0;
      const x = mapX(i);
      const y = mapY(r);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // points
    ctx.fillStyle = "#111";
    sessions.forEach((s, i) => {
      const r = s.total ? (s.correct / s.total) * 100 : 0;
      const x = mapX(i);
      const y = mapY(r);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // x labels (last 5)
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px system-ui, 'Noto Sans JP', sans-serif";
    const n = sessions.length;
    const start = Math.max(0, n - 5);
    for (let i = start; i < n; i++) {
      const x = mapX(i);
      const label = String(i + 1);
      ctx.fillText(label, x - 3, H - 12);
    }
  }

  // ===== イベント（必ずnullガード） =====
  if ($chapter) {
    $chapter.addEventListener("change", (e) => setChapter(e.target.value));
  }

  if ($direction) {
    $direction.addEventListener("change", (e) => {
      // モード変更前に、未保存セッションがあれば履歴化
      if (session.total) logSession("出題変更");

      direction = e.target.value;
      saveDirection();
      idx = 0;
      buildQuestions();
      buildOrder();

      resetSession("direction-change");
      render();
    });
  }

  if ($choiceMode) {
    $choiceMode.addEventListener("change", (e) => {
      if (session.total) logSession("選択肢変更");

      choiceMode = e.target.value;
      saveChoiceMode();
      idx = 0;
      buildQuestions();
      buildOrder();

      resetSession("choice-mode-change");
      render();
    });
  }

  if ($shuffle) $shuffle.addEventListener("click", shuffleOrder);

  if ($ngMode) {
    $ngMode.addEventListener("click", () => {
      if (session.total) logSession("NGモードへ");
      isNgMode = true;
      idx = 0;
      buildOrder();
      resetSession("ng-mode");
      render();
    });
  }

  if ($allMode) {
    $allMode.addEventListener("click", () => {
      if (session.total) logSession("全問モードへ");
      isNgMode = false;
      idx = 0;
      buildOrder();
      resetSession("all-mode");
      render();
    });
  }

  if ($next) $next.addEventListener("click", next);
  if ($prev) $prev.addEventListener("click", prev);
  if ($restart) $restart.addEventListener("click", restart);
  if ($resetStats) $resetStats.addEventListener("click", resetAllStats);

  // 履歴/CSV/グラフ
  if ($historyBtn) $historyBtn.addEventListener("click", openHistory);
  if ($closeHistory) $closeHistory.addEventListener("click", closeHistory);
  if ($historyModal) {
    $historyModal.addEventListener("click", (e) => {
      if (e.target === $historyModal) closeHistory();
    });
  }

  if ($exportCsvBtn) $exportCsvBtn.addEventListener("click", exportCsv);

  if ($showGraphBtn) $showGraphBtn.addEventListener("click", openGraph);
  if ($closeGraph) $closeGraph.addEventListener("click", closeGraph);
  if ($graphModal) {
    $graphModal.addEventListener("click", (e) => {
      if (e.target === $graphModal) closeGraph();
    });
  }

  // ===== 初期化 =====
  if ($chapter) $chapter.value = activeKey;
  if ($direction) $direction.value = direction;
  if ($choiceMode) $choiceMode.value = choiceMode;

  buildQuestions();
  buildOrder();
  render();
})();
