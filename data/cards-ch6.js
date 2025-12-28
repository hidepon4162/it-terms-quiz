window.CARDS_CH6 = [
    { id: "ch6-0001", chapter: 6, term: "スプーリング", definition: "CPUと低速な入出力装置の間のデータ転送を，高速な補助記憶装置に一時的に置いて仲介する技術。" },
    { id: "ch6-0002", chapter: 6, term: "バッファ", definition: "処理速度や転送速度の異なる装置間の速度差を吸収するための一時記憶領域。" },

    { id: "ch6-0003", chapter: 6, term: "ジョブ", definition: "利用者がコンピュータに依頼する仕事（実行単位）。" },
    { id: "ch6-0004", chapter: 6, term: "タスク", definition: "OSが管理する実行単位。スケジューリング対象として扱う。" },

    { id: "ch6-0005", chapter: 6, term: "マルチタスク", definition: "複数タスクを短い時間で切り替えながら実行し，同時に動いているように見せる方式。" },

    { id: "ch6-0006", chapter: 6, term: "タスクの状態（代表例）", definition: "実行可能状態（Ready）・実行状態（Running）・待ち状態（Waiting）など。" },

    { id: "ch6-0007", chapter: 6, term: "ディスパッチ", definition: "実行可能状態のタスクへCPUを割り当て，実行状態に遷移させること。" },

    { id: "ch6-0008", chapter: 6, term: "プリエンプティブ方式", definition: "CPUの使用権をOSが管理する。高優先度タスクが発生すると，低優先度タスクを中断して切り替える。" },
    { id: "ch6-0009", chapter: 6, term: "ノンプリエンプティブ方式", definition: "CPUの使用権をタスク側が握る方式。高優先度タスクが発生しても即時に奪えず，切替が遅れることがある。" },

    { id: "ch6-0010", chapter: 6, term: "ラウンドロビン方式", definition: "各タスクへ一定時間（タイムクォンタム）ずつCPUを割り当て，順番に切り替えて実行する方式。" },

    { id: "ch6-0011", chapter: 6, term: "ページング", definition: "仮想記憶と実記憶を固定長のページ/フレームに分割して対応付けて管理する方式。" },
    { id: "ch6-0012", chapter: 6, term: "ページフォールト", definition: "実記憶に存在しないページへアクセスしたときに発生する割込み（例外）。" },
    { id: "ch6-0013", chapter: 6, term: "ページ置換の流れ（概要）", definition: "仮想記憶アクセス→ページテーブル参照→ページフォールト→置換対象決定→ページアウト→ページイン。" },

    { id: "ch6-0014", chapter: 6, term: "LRU", definition: "Least Recently Used。最後の参照から最も時間が経過したページを置換対象とする方式。" },
    { id: "ch6-0015", chapter: 6, term: "スラッシング", definition: "ページイン/ページアウトが頻発して性能が極端に低下する現象。" },

    { id: "ch6-0016", chapter: 6, term: "ルートディレクトリ", definition: "階層型ファイルシステムの最上位ディレクトリ。" },
    { id: "ch6-0017", chapter: 6, term: "カレントディレクトリ", definition: "現在ユーザーが作業対象としているディレクトリ。" },
    { id: "ch6-0018", chapter: 6, term: "絶対パス", definition: "ルートディレクトリを基点として場所を示す表記。" },
    { id: "ch6-0019", chapter: 6, term: "相対パス", definition: "カレントディレクトリを基点として場所を示す表記。" },

    { id: "ch6-0020", chapter: 6, term: "フルバックアップ", definition: "常に全データをバックアップする方式。" },
    { id: "ch6-0021", chapter: 6, term: "差分バックアップ", definition: "直近のフルバックアップ以降に変更された分をバックアップする方式。" },
    { id: "ch6-0022", chapter: 6, term: "増分バックアップ", definition: "前回のバックアップ以降に変更された分だけをバックアップする方式。" },

    { id: "ch6-0023", chapter: 6, term: "ソースコード", definition: "人間が読みやすいプログラミング言語で書かれたプログラム。" },
    { id: "ch6-0024", chapter: 6, term: "オブジェクトコード", definition: "ソースコードを機械語（0と1等）に翻訳した中間成果物。" },

    { id: "ch6-0025", chapter: 6, term: "コンパイラ", definition: "ソースコードをオブジェクトコードへ翻訳・変換するツール。" },
    { id: "ch6-0026", chapter: 6, term: "コンパイラの処理工程（代表例）", definition: "字句解析→構文解析→意味解析→最適化→コード生成。" },
    { id: "ch6-0027", chapter: 6, term: "コンパイラ最適化", definition: "外部仕様を変えずに，より効率的に動くコードへ変換すること。" },

    { id: "ch6-0028", chapter: 6, term: "リンカ", definition: "複数のオブジェクトコードとライブラリ等を結合し，実行可能なプログラムを生成するツール。" },
    { id: "ch6-0029", chapter: 6, term: "ロードモジュール（実行可能形式）", definition: "実行可能なプログラム（リンク後の成果物）を指す。" },

    { id: "ch6-0030", chapter: 6, term: "インタプリタ", definition: "命令（文）を逐次解釈しながら実行する方式（コンパイルせずに実行する系も含む）。" },

    { id: "ch6-0031", chapter: 6, term: "ソースコード解析ツール", definition: "ソースコードを解析してバグや規約違反などを検出するツール（静的テストに分類される）。" },

    { id: "ch6-0032", chapter: 6, term: "Eclipse", definition: "OSSの代表的な統合開発環境（IDE）。" },

    { id: "ch6-0033", chapter: 6, term: "コピーレフト", definition: "派生物（2次著作物）にもオリジナルと同等の配布条件を適用する考え方（例：GPL系）。" }
];