(function () {
  "use strict";

  const KEYS = { CH: "v_ch", DIR: "v_dir", HIST: "v_hist", STATS: "v_stats" };

  // --- 1. データ準備（21章分を確実にスキャン） ---
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
    answered: false
  };

  const $ = (id) => document.getElementById(id);

  // --- 2. クイズの初期化 ---
  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    if (!ch) {
      const firstKey = Object.keys(chapters)[0];
      if (firstKey) {
        state.activeKey = firstKey;
        initQuiz();
      } else {
        $("question").textContent = "データが読み込まれていません。";
      }
      return;
    }

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

  // --- 3. 描画処理 ---
  const render = () => {
    state.answered = false;
    $("explainArea").style.display = "none";
    $("choices").innerHTML = "";

    if (state.questions.length === 0) return;

    const q = state.questions[state.idx];
    $("question").textContent = q.prompt;

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

        updateStats(q.id, isOk);
        showExplanation(q.card);
        saveHistory();
      };
      $("choices").appendChild(b);
    });
  };

  // --- 4. 解説表示（タブ同期） ---
  const showExplanation = (card) => {
    const ex = parseExtra(card.extraExplain);
    $("explainArea").style.display = "block";

    const updateTabContent = (key) => {
      $("tabBody").innerHTML = (ex[key] || "(未設定)").replace(/\n/g, "<br>");
    };

    const activeBtn = $("explainArea").querySelector(".tab-btn.active");
    const currentKey = activeBtn ? activeBtn.dataset.k : "point";
    updateTabContent(currentKey);

    $("explainArea").querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        $("explainArea").querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateTabContent(btn.dataset.k);
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

  // --- 5. データ管理（CSV出力・グラフ・履歴） ---
  const updateStats = (id, isOk) => {
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
      s: `${state.session.correct}/${state.session.total}`,
      r: Math.round((state.session.correct / state.session.total) * 100) + "%"
    };
    if (hist.length > 0 && hist[0].ch === entry.ch && state.session.total > 1) hist[0] = entry;
    else hist.unshift(entry);
    localStorage.setItem(KEYS.HIST, JSON.stringify(hist.slice(0, 10)));
  };

  // --- 6. 各種ボタンのイベント登録 ---

  // CSV出力
  const exportCsv = () => {
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    let csv = "\uFEFFid,章,用語,正解数,不正解数\n";
    Object.keys(chapters).forEach(k => {
      chapters[k].cards.forEach(c => {
        const s = stats[c.id] || { c: 0, w: 0 };
        csv += `${c.id},${chapters[k].name},"${c.term}",${s.c},${s.w}\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `grade_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // グラフ表示（案C：積み上げ）
  const showGraph = () => {
    $("graphModal").style.display = "flex";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    const labels = Object.keys(chapters).map(k => chapters[k].name);
    const dataMaster = [], dataLearning = [], dataBad = [], dataNone = [];

    Object.keys(chapters).forEach(k => {
      let master = 0, learning = 0, bad = 0, none = 0;
      chapters[k].cards.forEach(c => {
        const s = stats[c.id];
        if (!s || (s.c === 0 && s.w === 0)) none++;
        else if (s.w > s.c) bad++;
        else if (s.c >= 2) master++;
        else learning++;
      });
      dataMaster.push(master); dataLearning.push(learning); dataBad.push(bad); dataNone.push(none);
    });

    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart($("rateChart").getContext("2d"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'マスター(2回正解)', data: dataMaster, backgroundColor: '#3b82f6' },
          { label: '学習中', data: dataLearning, backgroundColor: '#fbbf24' },
          { label: '苦手', data: dataBad, backgroundColor: '#ef4444' },
          { label: '未着手', data: dataNone, backgroundColor: '#e2e8f0' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
  };

  // イベント紐付け
  $("chapterSelect").onchange = (e) => { state.activeKey = e.target.value; localStorage.setItem(KEYS.CH, e.target.value); initQuiz(); };
  $("directionSelect").onchange = (e) => { state.direction = e.target.value; localStorage.setItem(KEYS.DIR, e.target.value); initQuiz(); };
  $("shuffleBtn").onclick = () => { state.questions.sort(() => Math.random() - 0.5); render(); };
  $("nextBtn").onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; render(); } };
  $("prevBtn").onclick = () => { if (state.idx > 0) { state.idx--; render(); } };
  $("showHistoryBtn").onclick = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    $("historyBody").innerHTML = hist.map(h => `<tr><td>${h.d}</td><td>${h.ch}</td><td>${h.s}</td><td>${h.r}</td></tr>`).join("");
    $("historyModal").style.display = "flex";
  };
  $("showGraphBtn").onclick = showGraph;
  $("exportCsvBtn").onclick = exportCsv;
  $("resetStatsBtn").onclick = () => { if (confirm("成績をリセットしますか？")) { localStorage.clear(); location.reload(); } };

  document.querySelectorAll(".close-btn").forEach(b => b.onclick = () => {
    $("historyModal").style.display = "none";
    $("graphModal").style.display = "none";
  });

  // --- 7. 起動 ---
  Object.keys(chapters).forEach(k => {
    const o = document.createElement("option"); o.value = k; o.textContent = chapters[k].name;
    $("chapterSelect").appendChild(o);
  });
  $("chapterSelect").value = state.activeKey;
  $("directionSelect").value = state.direction;
  initQuiz();
})();