(function () {
  "use strict";

  // --- 設定 ---
  const KEYS = { CH: "v_ch", DIR: "v_dir", HIST: "v_hist", STATS: "v_stats" };

  // --- データ準備 ---
  const chapters = {};
  for (let i = 1; i <= 21; i++) {
    const varName = `CARDS_CH${i}`;
    if (window[varName]) {
      chapters[`ch${i}`] = { name: `${i}章`, cards: window[varName] };
    }
  }

  let state = {
    activeKey: localStorage.getItem(KEYS.CH) || "ch1",
    direction: localStorage.getItem(KEYS.DIR) || "forward",
    idx: 0,
    questions: [],
    session: { total: 0, correct: 0 },
    answered: false
  };

  const $ = (id) => document.getElementById(id);

  // --- クイズの初期化 ---
  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    if (!ch) return;

    state.questions = ch.cards.map(card => {
      const isFwd = state.direction === "forward";
      const correct = isFwd ? card.definition : card.term;
      let dummies = ch.cards.filter(c => c.id !== card.id).map(c => isFwd ? c.definition : c.term);
      dummies = dummies.sort(() => Math.random() - 0.5).slice(0, 3);

      return {
        id: card.id,
        prompt: isFwd ? card.term : card.definition,
        correct,
        card,
        choices: [correct, ...dummies].sort(() => Math.random() - 0.5)
      };
    });

    state.idx = 0;
    state.session = { total: 0, correct: 0 };
    render();
  };

  // --- クイズの描画 ---
  const render = () => {
    state.answered = false;
    $("explainArea").style.display = "none";
    $("choices").innerHTML = "";

    if (state.questions.length === 0) {
      $("question").textContent = "問題データがありません。";
      return;
    }

    const q = state.questions[state.idx];
    $("question").textContent = q.prompt;

    // 進捗表示の更新
    const progPercent = ((state.idx + 1) / state.questions.length) * 100;
    const rate = state.session.total === 0 ? 0 : Math.round((state.session.correct / state.session.total) * 100);

    $("progressFill").style.width = `${progPercent}%`;
    $("progressLabel").textContent = `${state.idx + 1} / ${state.questions.length}`;
    $("scoreLabel").textContent = `正解: ${state.session.correct} / ${state.session.total} (${rate}%)`;

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

        // 成績保存
        updateStats(q.id, isOk);
        showExplanation(q.card);
        saveHistory();
      };
      $("choices").appendChild(b);
    });
  };

  const showExplanation = (card) => {
    const ex = parseExtra(card.extraExplain);
    $("explainArea").style.display = "block";

    const setTab = (k) => $("tabBody").innerHTML = (ex[k] || "データがありません").replace(/\n/g, "<br>");
    setTab("point"); // 初期タブ

    $("explainArea").querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        $("explainArea").querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        setTab(btn.dataset.k);
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

  const saveHistory = () => {
    let hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    const rate = Math.round((state.session.correct / state.session.total) * 100) + "%";
    const entry = {
      d: new Date().toLocaleString(),
      ch: chapters[state.activeKey].name,
      s: `${state.session.correct}/${state.session.total}`,
      r: rate
    };
    if (hist.length > 0 && hist[0].ch === entry.ch && state.session.total > 1) hist[0] = entry;
    else hist.unshift(entry);
    localStorage.setItem(KEYS.HIST, JSON.stringify(hist.slice(0, 10)));
  };

  // --- イベント登録 ---
  $("chapterSelect").onchange = (e) => {
    state.activeKey = e.target.value;
    localStorage.setItem(KEYS.CH, e.target.value);
    initQuiz();
  };
  $("directionSelect").onchange = (e) => {
    state.direction = e.target.value;
    localStorage.setItem(KEYS.DIR, e.target.value);
    initQuiz();
  };
  $("shuffleBtn").onclick = () => { state.questions.sort(() => Math.random() - 0.5); render(); };
  $("nextBtn").onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; render(); } };
  $("prevBtn").onclick = () => { if (state.idx > 0) { state.idx--; render(); } };

  // 履歴表示
  $("showHistoryBtn").onclick = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    $("historyBody").innerHTML = hist.map(h => `<tr><td>${h.d}</td><td>${h.ch}</td><td>${h.s}</td><td>${h.r}</td></tr>`).join("");
    $("historyModal").style.display = "flex";
  };

  // グラフ表示
  $("showGraphBtn").onclick = () => {
    $("graphModal").style.display = "flex";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    const labels = Object.keys(chapters).map(k => chapters[k].name);
    const data = Object.keys(chapters).map(k => chapters[k].cards.filter(c => stats[c.id]?.c > 0).length);

    if (window.chartInstance) window.chartInstance.destroy();
    const ctx = $("rateChart").getContext("2d");
    window.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: '習得済用語数', data, backgroundColor: '#3b82f6', borderRadius: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  };

  // CSV出力
  $("exportCsvBtn").onclick = () => {
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    let csv = "\uFEFFid,章,用語,正解数\n";
    Object.values(chapters).forEach(ch => {
      ch.cards.forEach(c => {
        csv += `${c.id},${ch.name},"${c.term}",${stats[c.id]?.c || 0}\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `grade_report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  $("resetStatsBtn").onclick = () => { if (confirm("全成績と履歴を削除しますか？")) { localStorage.clear(); location.reload(); } };

  document.querySelectorAll(".close-btn").forEach(b => b.onclick = () => {
    $("historyModal").style.display = "none";
    $("graphModal").style.display = "none";
  });

  // --- 起動 ---
  Object.keys(chapters).forEach(k => {
    const o = document.createElement("option"); o.value = k; o.textContent = chapters[k].name;
    $("chapterSelect").appendChild(o);
  });
  $("chapterSelect").value = state.activeKey;
  $("directionSelect").value = state.direction;
  initQuiz();
})();