(function () {
  "use strict";

  const KEYS = { CH: "v_ch", DIR: "v_dir", HIST: "v_hist", STATS: "v_stats" };

  const chapters = {};
  for (let i = 1; i <= 21; i++) {
    if (window[`CARDS_CH${i}`]) chapters[`ch${i}`] = { name: `${i}章`, cards: window[`CARDS_CH${i}`] };
  }

  let state = {
    activeKey: localStorage.getItem(KEYS.CH) || "ch1",
    direction: localStorage.getItem(KEYS.DIR) || "forward",
    idx: 0, questions: [], session: { total: 0, correct: 0 }, answered: false
  };

  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    state.questions = ch.cards.map(card => {
      const isFwd = state.direction === "forward";
      const correct = isFwd ? card.definition : card.term;
      let dummies = ch.cards.filter(c => c.id !== card.id).map(c => isFwd ? c.definition : c.term);
      dummies = dummies.sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        id: card.id, prompt: isFwd ? card.term : card.definition,
        correct, card, choices: [correct, ...dummies].sort(() => Math.random() - 0.5)
      };
    });
    state.idx = 0;
    state.session = { total: 0, correct: 0 };
    render();
  };

  const render = () => {
    state.answered = false;
    $("explainArea").style.display = "none";
    $("choices").innerHTML = "";

    const q = state.questions[state.idx];
    $("question").textContent = q.prompt;

    // 進捗更新
    const progress = ((state.idx + 1) / state.questions.length) * 100;
    $("progressFill").style.width = `${progress}%`;
    $("progressLabel").textContent = `${state.idx + 1} / ${state.questions.length}`;
    $("scoreLabel").textContent = `正解: ${state.session.correct} / ${state.session.total}`;

    q.choices.forEach(txt => {
      const b = document.createElement("div");
      b.className = "choice";
      b.textContent = txt;
      b.onclick = () => {
        if (state.answered) return;
        state.answered = true;
        const isOk = (txt === q.correct);
        state.session.total++;
        if (isOk) state.session.correct++;

        b.classList.add(isOk ? "correct" : "wrong");
        Array.from($("choices").children).forEach(c => {
          if (c.textContent === q.correct) c.classList.add("correct");
        });

        // 解説表示
        const ex = parseExtra(q.card.extraExplain);
        $("explainArea").style.display = "block";
        const updateTab = (k) => $("tabBody").innerHTML = (ex[k] || "データなし").replace(/\n/g, "<br>");
        updateTab("point");

        $("explainArea").querySelectorAll(".tab-btn").forEach(btn => {
          btn.onclick = () => {
            $("explainArea").querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateTab(btn.dataset.k);
          };
        });
        saveHistory();
      };
      $("choices").appendChild(b);
    });
  };

  const parseExtra = (raw) => {
    const res = { point: "", trap: "", example: "", memo: "" };
    if (!raw) return res;
    raw.split(/(?=ポイント[:：]|ひっかけ[:：]|例[:：]|暗記[:：])/).forEach(p => {
      if (p.includes("ポイント")) res.point = p.replace(/ポイント[:：]/, "").trim();
      else if (p.includes("例")) res.example = p.replace(/例[:：]/, "").trim();
      else if (p.includes("暗記")) res.memo = p.replace(/暗記[:：]/, "").trim();
      else if (p.includes("ひっかけ")) res.trap = p.replace(/ひっかけ[:：]/, "").trim();
    });
    return res;
  };

  const saveHistory = () => {
    let hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    const entry = { d: new Date().toLocaleString(), ch: chapters[state.activeKey].name, s: `${state.session.correct}/${state.session.total}` };
    if (hist.length > 0 && hist[0].ch === entry.ch && state.session.total > 1) hist[0] = entry;
    else hist.unshift(entry);
    localStorage.setItem(KEYS.HIST, JSON.stringify(hist.slice(0, 10)));
  };

  // Events
  $("chapterSelect").onchange = (e) => { state.activeKey = e.target.value; localStorage.setItem(KEYS.CH, e.target.value); initQuiz(); };
  $("directionSelect").onchange = (e) => { state.direction = e.target.value; localStorage.setItem(KEYS.DIR, e.target.value); initQuiz(); };
  $("shuffleBtn").onclick = () => { state.questions.sort(() => Math.random() - 0.5); render(); };
  $("nextBtn").onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; render(); } };
  $("prevBtn").onclick = () => { if (state.idx > 0) { state.idx--; render(); } };

  $("showHistoryBtn").onclick = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    $("historyBody").innerHTML = hist.map(h => `<tr><td>${h.d}</td><td>${h.ch}</td><td>${h.s}</td><td>${Math.round((eval(h.s) || 0) * 100)}%</td></tr>`).join("");
    $("historyModal").style.display = "flex";
  };

  document.querySelectorAll(".close-btn").forEach(b => b.onclick = () => $("historyModal").style.display = "none");

  // 初期化
  Object.keys(chapters).forEach(k => {
    const o = document.createElement("option"); o.value = k; o.textContent = chapters[k].name;
    $("chapterSelect").appendChild(o);
  });
  $("chapterSelect").value = state.activeKey;
  $("directionSelect").value = state.direction;
  initQuiz();
})();