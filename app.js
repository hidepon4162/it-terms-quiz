(function () {
  "use strict";

  // --- 定数 & ストレージキー ---
  const KEYS = {
    STATS: "v_stats", NG: "v_ng", DIR: "v_dir",
    CH: "v_ch", HIST: "v_hist"
  };

  // --- データ準備 ---
  const chapters = {};
  for (let i = 1; i <= 21; i++) {
    const key = `ch${i}`;
    if (window[`CARDS_CH${i}`]) {
      chapters[key] = { name: `${i}章`, cards: window[`CARDS_CH${i}`] };
    }
  }

  // --- 状態管理 ---
  let state = {
    activeKey: localStorage.getItem(KEYS.CH) || "ch1",
    direction: localStorage.getItem(KEYS.DIR) || "forward",
    isNgMode: false,
    idx: 0,
    questions: [],
    session: { total: 0, correct: 0 },
    answered: false
  };

  // --- DOM要素の取得 ---
  const $ = (id) => document.getElementById(id);
  const UI = {
    chapter: $("chapterSelect"), direction: $("directionSelect"),
    question: $("question"), choices: $("choices"), explain: $("explainArea"),
    progress: $("progressLabel"), score: $("scoreLabel"),
    hModal: $("historyModal"), gModal: $("graphModal")
  };

  // --- 数式とHTML変換 ---
  const formatMath = (t) => t ? t.replace(/\$(.*?)\$/g, (_, c) => c.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')) : "";
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const parseExtra = (raw) => {
    const res = { point: "", trap: "", example: "", memo: "" };
    if (!raw) return res;
    raw.split(/(?=ポイント[:：]|ひっかけ[:：]|例[:：]|暗記[:：])/).forEach(p => {
      const s = p.trim();
      if (s.startsWith("ポイント")) res.point = s.replace(/^ポイント[:：]/, "");
      else if (s.startsWith("ひっかけ")) res.trap = s.replace(/^ひっかけ[:：]/, "");
      else if (s.startsWith("例")) res.example = s.replace(/^例[:：]/, "");
      else if (s.startsWith("暗記")) res.memo = s.replace(/^暗記[:：]/, "");
    });
    return res;
  };

  // --- クイズロジック ---
  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    if (!ch) return;

    state.questions = ch.cards.map(card => {
      const correct = (state.direction === "forward") ? card.definition : card.term;
      const prompt = (state.direction === "forward") ? card.term : card.definition;
      let dummies = ch.cards.filter(c => c.id !== card.id).map(c => (state.direction === "forward") ? c.definition : c.term);
      dummies = dummies.sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        id: card.id, prompt, correct, card,
        choices: [correct, ...dummies].sort(() => Math.random() - 0.5)
      };
    });

    if (state.isNgMode) {
      const ngData = JSON.parse(localStorage.getItem(KEYS.NG) || "{}")[state.activeKey] || {};
      state.questions = state.questions.filter(q => ngData[q.id]);
    }

    state.idx = 0;
    state.session = { total: 0, correct: 0 };
    render();
  };

  const render = () => {
    state.answered = false;
    UI.choices.innerHTML = ""; UI.explain.innerHTML = "";

    if (state.questions.length === 0) {
      UI.question.textContent = "対象の問題がありません。";
      return;
    }

    const q = state.questions[state.idx];
    UI.question.innerHTML = formatMath(esc(q.prompt));
    UI.progress.textContent = `${state.idx + 1} / ${state.questions.length}`;
    UI.score.textContent = `正解: ${state.session.correct} / ${state.session.total}`;

    q.choices.forEach(txt => {
      const b = document.createElement("div");
      b.className = "choice";
      b.innerHTML = formatMath(esc(txt));
      b.onclick = () => handleAnswer(q, b, txt);
      UI.choices.appendChild(b);
    });
  };

  const handleAnswer = (q, el, selected) => {
    if (state.answered) return;
    state.answered = true;
    const isOk = (selected === q.correct);

    state.session.total++;
    if (isOk) state.session.correct++;

    el.classList.add(isOk ? "correct" : "wrong");
    Array.from(UI.choices.children).forEach(c => {
      if (c.textContent === q.correct) c.classList.add("correct");
    });

    saveStats(q.id, isOk);
    saveHistory();

    const ex = parseExtra(q.card.extraExplain);
    UI.explain.innerHTML = `
      <div class="explainCard">
        <b>正解: ${formatMath(esc(q.correct))}</b>
        <div class="tabs">
          <button class="tabBtn active" data-k="point">ポイント</button>
          <button class="tabBtn" data-k="example">例</button>
          <button class="tabBtn" data-k="memo">暗記</button>
          <button class="tabBtn" data-k="trap">ひっかけ</button>
        </div>
        <div id="tabBody" class="tabPanel">${formatMath(esc(ex.point || "なし"))}</div>
      </div>
    `;

    UI.explain.querySelectorAll(".tabBtn").forEach(btn => {
      btn.onclick = () => {
        UI.explain.querySelectorAll(".tabBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const k = btn.dataset.k;
        $("tabBody").innerHTML = formatMath(esc(ex[k] || "なし")).replace(/\n/g, "<br>");
      };
    });
  };

  const saveStats = (id, isOk) => {
    let ng = JSON.parse(localStorage.getItem(KEYS.NG) || "{}");
    ng[state.activeKey] = ng[state.activeKey] || {};
    if (!isOk) ng[state.activeKey][id] = true; else delete ng[state.activeKey][id];
    localStorage.setItem(KEYS.NG, JSON.stringify(ng));

    let stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    stats[id] = stats[id] || { c: 0, w: 0 };
    if (isOk) stats[id].c++; else stats[id].w++;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  };

  const saveHistory = () => {
    let hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    const entry = {
      d: new Date().toLocaleString(),
      ch: chapters[state.activeKey].name,
      m: state.direction === "forward" ? "順" : "逆",
      s: `${state.session.correct}/${state.session.total}`,
      r: Math.round((state.session.correct / state.session.total) * 100) + "%"
    };
    if (hist.length > 0 && hist[0].ch === entry.ch && state.session.total > 1) hist[0] = entry;
    else hist.unshift(entry);
    localStorage.setItem(KEYS.HIST, JSON.stringify(hist.slice(0, 10)));
  };

  // --- イベント設定 ---
  // 設定変更
  UI.chapter.onchange = (e) => { state.activeKey = e.target.value; localStorage.setItem(KEYS.CH, state.activeKey); initQuiz(); };
  UI.direction.onchange = (e) => { state.direction = e.target.value; localStorage.setItem(KEYS.DIR, state.direction); initQuiz(); };
  $("allModeBtn").onclick = () => { state.isNgMode = false; initQuiz(); };
  $("ngModeBtn").onclick = () => { state.isNgMode = true; initQuiz(); };
  $("shuffleBtn").onclick = () => { state.questions.sort(() => Math.random() - 0.5); render(); };

  // ナビ
  $("nextBtn").onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; render(); } };
  $("prevBtn").onclick = () => { if (state.idx > 0) { state.idx--; render(); } };

  // モーダル表示
  $("showHistoryBtn").onclick = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    $("historyBody").innerHTML = hist.map(h => `<tr><td>${h.d}</td><td>${h.ch}</td><td>${h.m}</td><td>${h.s}</td><td>${h.r}</td></tr>`).join("") || '<tr><td colspan="5">履歴なし</td></tr>';
    UI.hModal.style.display = "flex";
  };

  $("showGraphBtn").onclick = () => {
    UI.gModal.style.display = "flex";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    const data = Object.keys(chapters).map(k => chapters[k].cards.filter(c => stats[c.id]?.c > 0).length);
    new Chart($("rateChart"), {
      type: 'bar',
      data: { labels: Object.keys(chapters).map(k => chapters[k].name), datasets: [{ label: '習得済', data, backgroundColor: '#3b82f6' }] }
    });
  };

  // モーダルを閉じる (すべてのclose-btnに対して設定)
  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.onclick = () => { UI.hModal.style.display = "none"; UI.gModal.style.display = "none"; };
  });

  // CSV
  $("exportCsvBtn").onclick = () => {
    let csv = "\uFEFFid,用語,正解数\n";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    Object.values(chapters).forEach(ch => ch.cards.forEach(c => {
      csv += `${c.id},"${c.term}",${stats[c.id]?.c || 0}\n`;
    }));
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "stats.csv"; a.click();
  };

  $("resetStatsBtn").onclick = () => { if (confirm("全消去しますか？")) { localStorage.clear(); location.reload(); } };

  // --- 初期起動 ---
  Object.keys(chapters).forEach(k => {
    const opt = document.createElement("option"); opt.value = k; opt.textContent = chapters[k].name;
    UI.chapter.appendChild(opt);
  });
  UI.chapter.value = state.activeKey;
  UI.direction.value = state.direction;
  initQuiz();
})();