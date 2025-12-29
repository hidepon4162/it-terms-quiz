(function () {
  "use strict";

  // ===== ローカルストレージキー =====
  const LS_STATS = "vocab_card_quiz_stats_v1";
  const LS_NG = "vocab_card_quiz_ng_v1";
  const LS_DIR = "vocab_card_quiz_direction_v1";
  const LS_CHOICE_MODE = "vocab_card_quiz_choice_mode_v1";
  const LS_CHAPTER = "vocab_card_quiz_chapter_v1";
  const LS_HISTORY = "vocab_card_quiz_session_history_v1";
  const LS_CRAM = "vocab_card_quiz_cram_mode_v1";

  // ===== カードデータ統合 =====
  const chapters = {};
  for (let i = 1; i <= 21; i++) {
    const key = `ch${i}`;
    chapters[key] = { name: `${i}章`, cards: (window[`CARDS_CH${i}`] || []).slice() };
  }

  // ===== 状態管理 =====
  let activeKey = localStorage.getItem(LS_CHAPTER) || "ch1";
  let direction = localStorage.getItem(LS_DIR) || "forward";
  let choiceMode = localStorage.getItem(LS_CHOICE_MODE) || "auto";
  let isNgMode = false;
  let cramMode = localStorage.getItem(LS_CRAM) === "1";

  let questions = [];
  let order = [];
  let idx = 0;
  let answered = false;
  let session = { total: 0, correct: 0 };

  // ===== DOM取得 (index.htmlのIDに完全準拠) =====
  const $chapter = document.getElementById("chapter");
  const $direction = document.getElementById("direction");
  const $choiceMode = document.getElementById("choiceMode");
  const $question = document.getElementById("question");
  const $choices = document.getElementById("choices");
  const $explain = document.getElementById("explain");
  const $progress = document.getElementById("progress");
  const $score = document.getElementById("score");

  // ボタン類
  const $historyBtn = document.getElementById("history");
  const $exportCsvBtn = document.getElementById("exportCsv");
  const $showGraphBtn = document.getElementById("showGraph");
  const $resetStats = document.getElementById("resetStats");

  // モーダル類
  const $historyModal = document.getElementById("historyModal");
  const $graphModal = document.getElementById("graphModal");
  const $historyBody = document.getElementById("historyBody");

  // ===== 数式変換 =====
  function formatMath(text) {
    if (!text) return "";
    return text.replace(/\$(.*?)\$/g, (match, content) => {
      let res = content.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>');
      if (res.length === 1 && /[a-zA-Z]/.test(res)) return `<i>${res}</i>`;
      return res;
    });
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // ==============================
  // 修正ポイント：全角コロン（：）と半角（:）の両方に対応
  // ==============================
  function parseExtra(raw) {
    const res = { point: "", trap: "", example: "", memo: "" };
    if (!raw) return res;
    // 分割ルールを全角・半角両対応に
    const parts = raw.split(/(?=ポイント[:：]|ひっかけ[:：]|例[:：]|暗記[:：])/);
    parts.forEach(p => {
      const s = p.trim();
      if (s.startsWith("ポイント")) res.point = s.replace(/^ポイント[:：]/, "").trim();
      else if (s.startsWith("ひっかけ")) res.trap = s.replace(/^ひっかけ[:：]/, "").trim();
      else if (s.startsWith("例")) res.example = s.replace(/^例[:：]/, "").trim();
      else if (s.startsWith("暗記")) res.memo = s.replace(/^暗記[:：]/, "").trim();
    });
    return res;
  }

  // ===== クイズロジック =====
  function buildQuestions() {
    const ch = chapters[activeKey];
    if (!ch) return (questions = []);
    questions = ch.cards.map(card => {
      const mode = (choiceMode === "auto") ? (direction === "forward" ? "def" : "term") : choiceMode;
      const correct = (mode === "def") ? card.definition : card.term;
      let dummies = ch.cards.filter(c => c.id !== card.id).map(c => (mode === "def") ? c.definition : c.term);
      dummies.sort(() => Math.random() - 0.5);
      return { cardId: card.id, prompt: (direction === "forward") ? card.term : card.definition, correct: correct, choices: [correct, ...dummies.slice(0, 3)].sort(() => Math.random() - 0.5), card: card };
    });
  }

  function buildOrder() {
    order = questions.map((_, i) => i);
    if (isNgMode) {
      const ngData = JSON.parse(localStorage.getItem(LS_NG) || "{}")[activeKey] || {};
      order = order.filter(i => ngData[questions[i].cardId]);
    } else {
      order.sort(() => Math.random() - 0.5);
    }
  }

  function render() {
    answered = false;
    $choices.innerHTML = "";
    $explain.innerHTML = "";
    if (order.length === 0) {
      $question.innerHTML = isNgMode ? "NG登録された問題はありません。" : "問題がありません。";
      return;
    }
    const q = questions[order[idx]];
    $question.innerHTML = formatMath(escapeHtml(q.prompt));
    $progress.textContent = `${idx + 1} / ${order.length}`;
    $score.textContent = `正解: ${session.correct} / 回答: ${session.total}`;

    q.choices.forEach(text => {
      const btn = document.createElement("div");
      btn.className = "choice";
      btn.innerHTML = formatMath(escapeHtml(text));
      btn.onclick = () => handleAnswer(q, btn, text);
      $choices.appendChild(btn);
    });
  }

  function handleAnswer(q, btn, selectedText) {
    if (answered) return;
    answered = true;
    const isCorrect = (selectedText === q.correct);
    session.total++;
    if (isCorrect) session.correct++;

    btn.classList.add(isCorrect ? "correct" : "wrong");
    Array.from($choices.children).forEach(el => { if (el.textContent === q.correct) el.classList.add("correct"); });

    updateStats(q.cardId, isCorrect);

    const extra = parseExtra(q.card.extraExplain);

    // 解説部分のHTML構築
    $explain.innerHTML = `
      <div class="explainCard">
        <div style="font-weight:bold; color:${isCorrect ? "#22c55e" : "#ef4444"}; margin-bottom:8px;">
          ${isCorrect ? "● 正解" : "× 不正解"}
        </div>
        <div style="margin-bottom:12px;"><b>正解：</b>${formatMath(escapeHtml(q.correct))}</div>
        <details>
          <summary style="cursor:pointer; font-size:12px; color:#6b7280;">▼ 詳細解説を表示</summary>
          <div class="tabs">
            <button class="tabBtn active" data-key="point">ポイント</button>
            <button class="tabBtn" data-key="example">例</button>
            <button class="tabBtn" data-key="memo">暗記</button>
            <button class="tabBtn" data-key="trap">ひっかけ</button>
          </div>
          <div id="tab-body" class="tabPanel">
            ${formatMath(escapeHtml(extra.point || "（未設定）")).replace(/\n/g, "<br>")}
          </div>
        </details>
      </div>
    `;

    // タブ切り替えイベント
    $explain.querySelectorAll(".tabBtn").forEach(t => {
      t.onclick = (e) => {
        e.stopPropagation();
        $explain.querySelectorAll(".tabBtn").forEach(b => b.classList.remove("active"));
        t.classList.add("active");
        const key = t.getAttribute("data-key");
        document.getElementById("tab-body").innerHTML = formatMath(escapeHtml(extra[key] || "（未設定）")).replace(/\n/g, "<br>");
      };
    });
  }

  function updateStats(id, isCorrect) {
    let ngData = JSON.parse(localStorage.getItem(LS_NG) || "{}");
    ngData[activeKey] = ngData[activeKey] || {};
    if (!isCorrect) ngData[activeKey][id] = true; else delete ngData[activeKey][id];
    localStorage.setItem(LS_NG, JSON.stringify(ngData));

    let stats = JSON.parse(localStorage.getItem(LS_STATS) || "{}");
    stats[id] = stats[id] || { c: 0, w: 0 };
    if (isCorrect) stats[id].c++; else stats[id].w++;
    localStorage.setItem(LS_STATS, JSON.stringify(stats));
  }

  function saveSessionHistory() {
    if (session.total === 0) return;
    let history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
    history.unshift({
      date: new Date().toLocaleString(),
      chapter: chapters[activeKey].name,
      mode: direction === "forward" ? "順引き" : (direction === "reverse" ? "逆引き" : "混合"),
      score: `${session.correct}/${session.total}`,
      rate: Math.round((session.correct / session.total) * 100) + "%"
    });
    localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(0, 10)));
  }

  // ===== イベント登録 =====
  document.getElementById("next").onclick = () => { if (idx < order.length - 1) { idx++; render(); } else { saveSessionHistory(); alert("終了です。"); } };
  document.getElementById("prev").onclick = () => { if (idx > 0) { idx--; render(); } };
  document.getElementById("restart").onclick = () => { saveSessionHistory(); session = { total: 0, correct: 0 }; idx = 0; buildOrder(); render(); };
  document.getElementById("allMode").onclick = () => { isNgMode = false; document.getElementById("restart").click(); };
  document.getElementById("ngMode").onclick = () => { isNgMode = true; document.getElementById("restart").click(); };
  document.getElementById("shuffle").onclick = () => { buildOrder(); idx = 0; render(); };

  if ($historyBtn) {
    $historyBtn.onclick = () => {
      const history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
      $historyBody.innerHTML = history.map(h => `
        <tr>
          <td>${h.date}</td><td>${h.chapter}</td><td>${h.mode}</td>
          <td>-</td><td>-</td><td>${h.score.split('/')[0]}</td>
          <td>${h.score.split('/')[1]}</td><td>${h.rate}</td><td></td>
        </tr>
      `).join("") || '<tr><td colspan="9">履歴なし</td></tr>';
      $historyModal.removeAttribute("hidden");
    };
  }

  if ($showGraphBtn) {
    $showGraphBtn.onclick = () => {
      $graphModal.removeAttribute("hidden");
      const stats = JSON.parse(localStorage.getItem(LS_STATS) || "{}");
      const ctx = document.getElementById("rateChart").getContext("2d");
      const data = Object.keys(chapters).map(k => {
        let count = 0;
        chapters[k].cards.forEach(c => { if (stats[c.id] && stats[c.id].c > 0) count++; });
        return count;
      });
      if (window.myChart) window.myChart.destroy();
      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: Object.keys(chapters).map(k => chapters[k].name), datasets: [{ label: '習得済', data: data, backgroundColor: '#111' }] }
      });
    };
  }

  if ($exportCsvBtn) {
    $exportCsvBtn.onclick = () => {
      let stats = JSON.parse(localStorage.getItem(LS_STATS) || "{}");
      let csv = "\uFEFFid,用語,正解,不正解\n";
      Object.keys(chapters).forEach(k => {
        chapters[k].cards.forEach(c => {
          let s = stats[c.id] || { c: 0, w: 0 };
          csv += `${c.id},"${c.term}",${s.c},${s.w}\n`;
        });
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "stats.csv";
      link.click();
    };
  }

  if ($resetStats) {
    $resetStats.onclick = () => { if (confirm("消去しますか？")) { localStorage.clear(); location.reload(); } };
  }

  document.getElementById("closeHistory").onclick = () => $historyModal.setAttribute("hidden", "");
  document.getElementById("closeGraph").onclick = () => $graphModal.setAttribute("hidden", "");

  $chapter.onchange = (e) => { activeKey = e.target.value; localStorage.setItem(LS_CHAPTER, activeKey); document.getElementById("restart").click(); };
  $direction.onchange = (e) => { direction = e.target.value; localStorage.setItem(LS_DIR, direction); render(); };
  $choiceMode.onchange = (e) => { choiceMode = e.target.value; localStorage.setItem(LS_CHOICE_MODE, choiceMode); render(); };

  // 初期化
  $chapter.value = activeKey;
  $direction.value = direction;
  $choiceMode.value = choiceMode;
  buildQuestions(); buildOrder(); render();

})();