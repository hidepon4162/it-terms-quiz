(function () {
  "use strict";

  const KEYS = { CH: "v_ch", DIR: "v_dir", HIST: "v_hist", STATS: "v_stats" };

  // --- 1. データ準備 ---
  const chapters = {};
  for (let i = 1; i <= 21; i++) {
    const varName = `CARDS_CH${i}`;
    if (window[varName] && window[varName].length > 0) {
      chapters[`ch${i}`] = { name: `${i}章`, cards: window[varName] };
    }
  }

  let state = {
    activeKey: localStorage.getItem(KEYS.CH) || "ch1",
    direction: localStorage.getItem(KEYS.DIR) || "forward",
    idx: 0,
    questions: [],
    session: { total: 0, correct: 0 },
    answered: false,
    isNgOnly: false
  };

  const $ = (id) => document.getElementById(id);

  // --- 2. クイズの初期化 ---
  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    if (!ch) return;

    let sourceCards = ch.cards;
    if (state.isNgOnly) {
      const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
      sourceCards = ch.cards.filter(c => {
        const s = stats[c.id];
        return !s || s.w > 0 || s.c < 2; // 不正解がある、または正解2回未満
      });
      if (sourceCards.length === 0) {
        alert("この章に苦手な問題はありません！全問モードに切り替えます。");
        state.isNgOnly = false;
        sourceCards = ch.cards;
      }
    }

    state.questions = sourceCards.map(card => {
      const isFwd = state.direction === "forward";
      const correct = isFwd ? card.definition : card.term;
      let dummies = ch.cards.filter(c => c.id !== card.id).map(c => isFwd ? c.definition : c.term);
      dummies = dummies.sort(() => Math.random() - 0.5).slice(0, 3);
      return { id: card.id, prompt: isFwd ? card.term : card.definition, correct, card, choices: [correct, ...dummies].sort(() => Math.random() - 0.5) };
    });

    state.idx = 0;
    state.session = { total: 0, correct: 0 };
    render();
  };

  // --- 3. 描画処理 ---
  const render = () => {
    state.answered = false;
    $("explainArea").style.display = "none";
    $("choices").innerHTML = "";
    if (state.questions.length === 0) return;

    const q = state.questions[state.idx];
    $("question").textContent = q.prompt;

    const progPercent = ((state.idx + 1) / state.questions.length) * 100;
    $("progressFill").style.width = `${progPercent}%`;
    $("progressLabel").textContent = `${state.idx + 1} / ${state.questions.length}`;
    $("scoreLabel").textContent = `正解: ${state.session.correct} / ${state.session.total}`;

    q.choices.forEach((txt, i) => {
      const b = document.createElement("div");
      b.className = "choice";
      b.innerHTML = `<span class="choice-num">${i + 1}</span>${txt}`;
      b.onclick = () => {
        if (state.answered) return;
        state.answered = true;
        const isOk = (txt === q.correct);
        state.session.total++;
        if (isOk) state.session.correct++;
        b.classList.add(isOk ? "correct" : "wrong");
        Array.from($("choices").children).forEach(c => {
          if (c.innerText.includes(q.correct)) c.classList.add("correct");
        });
        updateStats(q.id, isOk);
        showExplanation(q.card);
      };
      $("choices").appendChild(b);
    });
  };

  // --- 4. 解説表示 & データ管理 ---
  const showExplanation = (card) => {
    const ex = parseExtra(card.extraExplain);
    $("explainArea").style.display = "block";
    const updateTab = (key) => { $("tabBody").innerHTML = (ex[key] || "(データなし)").replace(/\n/g, "<br>"); };
    const activeBtn = $("explainArea").querySelector(".tab-btn.active");
    updateTab(activeBtn ? activeBtn.dataset.k : "point");
    $("explainArea").querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        $("explainArea").querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateTab(btn.dataset.k);
      };
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

  const updateStats = (id, isOk) => {
    let stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    stats[id] = stats[id] || { c: 0, w: 0 };
    if (isOk) stats[id].c++; else stats[id].w++;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  };

  // --- 5. キーボード操作 ---
  window.addEventListener("keydown", (e) => {
    if (e.key >= "1" && e.key <= "4") {
      const choices = $("choices").querySelectorAll(".choice");
      if (choices[e.key - 1] && !state.answered) choices[e.key - 1].click();
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (state.answered) $("nextBtn").click();
    }
  });

  // --- 6. 各種ボタン登録 ---
  $("chapterSelect").onchange = (e) => { state.activeKey = e.target.value; localStorage.setItem(KEYS.CH, e.target.value); initQuiz(); };
  $("directionSelect").onchange = (e) => { state.direction = e.target.value; localStorage.setItem(KEYS.DIR, e.target.value); initQuiz(); };
  $("allModeBtn").onclick = () => { state.isNgOnly = false; initQuiz(); };
  $("weakModeBtn").onclick = () => { state.isNgOnly = true; initQuiz(); };
  $("shuffleBtn").onclick = () => { state.questions.sort(() => Math.random() - 0.5); render(); };
  $("nextBtn").onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; render(); } };
  $("prevBtn").onclick = () => { if (state.idx > 0) { state.idx--; render(); } };

  $("showGraphBtn").onclick = () => {
    $("graphModal").style.display = "flex";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    const labels = Object.keys(chapters).map(k => chapters[k].name);
    const dM = [], dL = [], dB = [], dN = [];
    Object.keys(chapters).forEach(k => {
      let m = 0, l = 0, b = 0, n = 0;
      chapters[k].cards.forEach(c => {
        const s = stats[c.id];
        if (!s || (s.c === 0 && s.w === 0)) n++; else if (s.w > s.c) b++; else if (s.c >= 2) m++; else l++;
      });
      dM.push(m); dL.push(l); dB.push(b); dN.push(n);
    });
    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart($("rateChart").getContext("2d"), {
      type: 'bar', data: {
        labels, datasets: [
          { label: 'マスター', data: dM, backgroundColor: '#3b82f6' },
          { label: '学習中', data: dL, backgroundColor: '#fbbf24' },
          { label: '苦手', data: dB, backgroundColor: '#ef4444' },
          { label: '未着手', data: dN, backgroundColor: '#e2e8f0' }
        ]
      }, options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
  };

  $("exportCsvBtn").onclick = () => {
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    let csv = "\uFEFFid,章,用語,正解数,不正解数\n";
    Object.keys(chapters).forEach(k => chapters[k].cards.forEach(c => {
      const s = stats[c.id] || { c: 0, w: 0 };
      csv += `${c.id},${chapters[k].name},"${c.term}",${s.c},${s.w}\n`;
    }));
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  $("resetStatsBtn").onclick = () => { if (confirm("成績をリセットしますか？")) { localStorage.clear(); location.reload(); } };
  document.querySelectorAll(".close-btn").forEach(b => b.onclick = () => { $(".modal").style.display = "none"; $("graphModal").style.display = "none"; $("historyModal").style.display = "none"; });

  // --- 7. 起動 ---
  Object.keys(chapters).forEach(k => {
    const o = document.createElement("option"); o.value = k; o.textContent = chapters[k].name;
    $("chapterSelect").appendChild(o);
  });
  $("chapterSelect").value = state.activeKey;
  initQuiz();
})();