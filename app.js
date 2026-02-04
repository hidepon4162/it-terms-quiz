(function () {
  "use strict";

  const KEYS = { CH: "v_ch", DIR: "v_dir", HIST: "v_hist", STATS: "v_stats" };

  const $ = (id) => document.getElementById(id);

  // --- 数式レンダリング（KaTeX auto-render） ---
  const renderMath = (rootEl) => {
    if (!rootEl) return;
    if (!window.renderMathInElement) return;

    window.renderMathInElement(rootEl, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  };

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

  // --- 2. クイズの初期化 ---
  const initQuiz = () => {
    const ch = chapters[state.activeKey];
    if (!ch) return;

    let sourceCards = ch.cards;
    if (state.isNgOnly) {
      const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
      sourceCards = ch.cards.filter((c) => {
        const s = stats[c.id];
        return !s || s.w > 0 || s.c < 2; // 不正解がある、または正解2回未満
      });
      if (sourceCards.length === 0) {
        alert("この章に苦手な問題はありません！全問モードに切り替えます。");
        state.isNgOnly = false;
        sourceCards = ch.cards;
      }
    }

    state.questions = sourceCards.map((card) => {
      const isFwd = state.direction === "forward";
      const correct = isFwd ? card.definition : card.term;
      let dummies = ch.cards
        .filter((c) => c.id !== card.id)
        .map((c) => (isFwd ? c.definition : c.term));
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

    // 問題文
    const qEl = $("question");
    qEl.textContent = q.prompt;
    renderMath(qEl);

    // 進捗
    const progPercent = ((state.idx + 1) / state.questions.length) * 100;
    $("progressFill").style.width = `${progPercent}%`;
    $("progressLabel").textContent = `${state.idx + 1} / ${state.questions.length}`;
    $("scoreLabel").textContent = `正解: ${state.session.correct} / ${state.session.total}`;

    // 選択肢
    q.choices.forEach((txt, i) => {
      const b = document.createElement("div");
      b.className = "choice";

      // KaTeX描画後にinnerTextが変わるので、正解判定はDOM文字列に依存しない
      b.dataset.isCorrect = String(txt === q.correct);

      // 番号はHTML、選択肢本文はTextNodeで安全に追加（数式はテキスト内の$...$をKaTeXが処理）
      b.innerHTML = `<span class="choice-num">${i + 1}</span>`;
      b.appendChild(document.createTextNode(txt));

      // 選択肢中の数式も描画
      renderMath(b);

      b.onclick = () => {
        if (state.answered) return;
        state.answered = true;

        const isOk = b.dataset.isCorrect === "true";
        state.session.total++;
        if (isOk) state.session.correct++;

        b.classList.add(isOk ? "correct" : "wrong");

        Array.from($("choices").children).forEach((c) => {
          if (c.dataset.isCorrect === "true") c.classList.add("correct");
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

    const updateTab = (key) => {
      const el = $("tabBody");
      el.innerHTML = (ex[key] || "(データなし)").replace(/\n/g, "<br>");
      renderMath(el);
    };

    const activeBtn = $("explainArea").querySelector(".tab-btn.active");
    updateTab(activeBtn ? activeBtn.dataset.k : "point");

    $("explainArea")
      .querySelectorAll(".tab-btn")
      .forEach((btn) => {
        btn.onclick = () => {
          $("explainArea")
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          updateTab(btn.dataset.k);
        };
      });
  };

  const parseExtra = (raw) => {
    const res = { point: "", trap: "", example: "", memo: "" };
    if (!raw) return res;

    // 戦略：文章の途中にある「例：」に反応しないよう、
    // 「改行の直後にあるキーワード」または「文字列の先頭にあるキーワード」のみを区切りにする
    const parts = raw.split(
      /\n(?=ポイント[:：]|ひっかけ[:：]|例[:：]|暗記[:：])|^ポイント[:：]|^ひっかけ[:：]|^例[:：]|^暗記[:：]/
    );

    parts.forEach((p) => {
      const text = p.trim();

      if (text.startsWith("ポイント")) res.point = text.replace(/^ポイント[:：]/, "").trim();
      else if (text.startsWith("ひっかけ")) res.trap = text.replace(/^ひっかけ[:：]/, "").trim();
      else if (text.startsWith("例")) res.example = text.replace(/^例[:：]/, "").trim();
      else if (text.startsWith("暗記")) res.memo = text.replace(/^暗記[:：]/, "").trim();
      else if (!res.point && text) res.point = text; // フォールバック
    });

    return res;
  };

  const updateStats = (id, isOk) => {
    let stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    stats[id] = stats[id] || { c: 0, w: 0 };
    if (isOk) stats[id].c++;
    else stats[id].w++;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  };

  // 追加：履歴を保存（1セット終了時に1件）
  const pushHistory = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");

    const ch = chapters[state.activeKey];
    const total = state.session.total;
    const correct = state.session.correct;
    const rate = total ? Math.round((correct / total) * 100) : 0;

    const now = new Date();
    const d =
      `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(
        now.getDate()
      ).padStart(2, "0")} ` +
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
        2,
        "0"
      )}`;

    hist.push({
      d, // 日時
      ch: ch ? ch.name : state.activeKey, // 章
      s: `${correct} / ${total}`, // 正解数
      r: `${rate}%` // 正解率
    });

    localStorage.setItem(KEYS.HIST, JSON.stringify(hist));
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

    // 追加：回答後のみ ←/→ で前後移動
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      // スクロール等の既定動作を抑制（学習テンポ優先）
      e.preventDefault();

      // ルール：回答後のみ有効
      if (!state.answered) return;

      if (e.key === "ArrowLeft") $("prevBtn").click();
      else $("nextBtn").click();
    }
  });

  // --- 6. 各種ボタン登録 ---
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
  $("allModeBtn").onclick = () => {
    state.isNgOnly = false;
    initQuiz();
  };
  $("weakModeBtn").onclick = () => {
    state.isNgOnly = true;
    initQuiz();
  };
  $("shuffleBtn").onclick = () => {
    state.questions.sort(() => Math.random() - 0.5);
    render();
  };

  // 修正：最後まで解いたら履歴保存
  $("nextBtn").onclick = () => {
    // 未回答のまま次へ進むと履歴が壊れるのでブロック
    if (!state.answered) return;

    // 最後なら保存して終了
    if (state.idx >= state.questions.length - 1) {
      pushHistory();
      alert("このセットは終了です。履歴に保存しました。");
      return;
    }

    state.idx++;
    render();
  };

  $("prevBtn").onclick = () => {
    if (state.idx > 0) {
      state.idx--;
      render();
    }
  };

  $("showGraphBtn").onclick = () => {
    $("graphModal").style.display = "flex";
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    const labels = Object.keys(chapters).map((k) => chapters[k].name);
    const dM = [],
      dL = [],
      dB = [],
      dN = [];
    Object.keys(chapters).forEach((k) => {
      let m = 0,
        l = 0,
        b = 0,
        n = 0;
      chapters[k].cards.forEach((c) => {
        const s = stats[c.id];
        if (!s || (s.c === 0 && s.w === 0)) n++;
        else if (s.w > s.c) b++;
        else if (s.c >= 2) m++;
        else l++;
      });
      dM.push(m);
      dL.push(l);
      dB.push(b);
      dN.push(n);
    });
    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart($("rateChart").getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "マスター", data: dM, backgroundColor: "#3b82f6" },
          { label: "学習中", data: dL, backgroundColor: "#fbbf24" },
          { label: "苦手", data: dB, backgroundColor: "#ef4444" },
          { label: "未着手", data: dN, backgroundColor: "#e2e8f0" }
        ]
      },
      options: {
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true } }
      }
    });
  };

  $("exportCsvBtn").onclick = () => {
    const stats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
    let csv = "\uFEFFid,章,用語,正解数,不正解数\n";
    Object.keys(chapters).forEach((k) =>
      chapters[k].cards.forEach((c) => {
        const s = stats[c.id] || { c: 0, w: 0 };
        csv += `${c.id},${chapters[k].name},"${c.term}",${s.c},${s.w}\n`;
      })
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  $("resetStatsBtn").onclick = () => {
    if (confirm("成績をリセットしますか？")) {
      localStorage.clear();
      location.reload();
    }
  };

  // 閉じるボタン（履歴・グラフ共通）
  document.querySelectorAll(".close-btn").forEach((b) => {
    b.onclick = () => {
      $("historyModal").style.display = "none";
      $("graphModal").style.display = "none";
    };
  });

  // モーダル背景クリックで閉じる
  window.onclick = (event) => {
    if (event.target == $("historyModal")) $("historyModal").style.display = "none";
    if (event.target == $("graphModal")) $("graphModal").style.display = "none";
  };

  // 履歴表示
  $("showHistoryBtn").onclick = () => {
    const hist = JSON.parse(localStorage.getItem(KEYS.HIST) || "[]");
    const html =
      hist.length > 0
        ? hist
          .map((h) => `<tr><td>${h.d}</td><td>${h.ch}</td><td>${h.s}</td><td>${h.r}</td></tr>`)
          .join("")
        : '<tr><td colspan="4" style="text-align:center;">履歴がありません</td></tr>';

    $("historyBody").innerHTML = html;
    $("historyModal").style.display = "flex";
  };

  // --- 7. 起動 ---
  Object.keys(chapters).forEach((k) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = chapters[k].name;
    $("chapterSelect").appendChild(o);
  });
  $("chapterSelect").value = state.activeKey;
  initQuiz();
})();