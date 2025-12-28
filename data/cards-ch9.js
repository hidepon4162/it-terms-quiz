window.CARDS_CH9 = [
    { id: "ch9-0001", chapter: 9, term: "関係データベース", definition: "データを2次元の表（テーブル）で管理するデータベース。" },
    { id: "ch9-0002", chapter: 9, term: "主キー", definition: "行（レコード）を一意に識別する列（または列の組）。同一値不可，NULL不可。" },
    { id: "ch9-0003", chapter: 9, term: "外部キー", definition: "他テーブルの主キーを参照する列。参照一貫性を保つために用いる。" },

    { id: "ch9-0004", chapter: 9, term: "E-R図", definition: "データの関係性を表す設計図。エンティティ（実体）とリレーションシップ（関連）で表す。" },
    { id: "ch9-0005", chapter: 9, term: "関数従属", definition: "ある属性の値が決まると，別の属性の値が一意に決まる関係。" },
    { id: "ch9-0006", chapter: 9, term: "正規化の目的（要点）", definition: "冗長・更新不整合を減らすために表を分割し，依存関係を整理すること（試験向け要点：主キーに完全従属させる）。" },

    { id: "ch9-0007", chapter: 9, term: "選択（リレーショナル）", definition: "テーブルから条件に合う行（レコード）だけを取り出す操作。" },
    { id: "ch9-0008", chapter: 9, term: "射影（リレーショナル）", definition: "テーブルから必要な列だけを取り出す操作。" },
    { id: "ch9-0009", chapter: 9, term: "結合", definition: "複数テーブルを関連列で結びつけて1つの結果表を得る操作。" },

    { id: "ch9-0010", chapter: 9, term: "SQL", definition: "関係データベースを操作するための言語。" },
    { id: "ch9-0011", chapter: 9, term: "SELECT文", definition: "テーブルからデータを取り出す命令。選択・射影などに相当する操作を行う。" },
    { id: "ch9-0012", chapter: 9, term: "FROM句", definition: "検索対象のテーブルを指定する。" },
    { id: "ch9-0013", chapter: 9, term: "WHERE句", definition: "行（レコード）に対する条件を指定する。" },
    { id: "ch9-0014", chapter: 9, term: "GROUP BY句", definition: "指定列でグループ化する。" },
    { id: "ch9-0015", chapter: 9, term: "HAVING句", definition: "グループ化後の結果に対する条件を指定する。" },
    { id: "ch9-0016", chapter: 9, term: "ORDER BY句", definition: "結果を並べ替える。" },
    { id: "ch9-0017", chapter: 9, term: "AS句", definition: "列名や表名に別名（エイリアス）を付ける。" },
    { id: "ch9-0018", chapter: 9, term: "インデックス", definition: "検索を高速化するための補助データ構造。" },
    { id: "ch9-0019", chapter: 9, term: "ストアドプロシージャ", definition: "複数の命令をまとめてDBMSに保存した手続き（プログラム）。" },

    { id: "ch9-0020", chapter: 9, term: "原子性（Atomicity）", definition: "トランザクション内の処理が「全て実行」か「全て取り消し」のどちらかになる性質。" },
    { id: "ch9-0021", chapter: 9, term: "ログファイル", definition: "トランザクション前後の状態（更新前/更新後ログ等）を記録するファイル。" },
    { id: "ch9-0022", chapter: 9, term: "ロールバック", definition: "更新前ログなどを用いて更新を取り消し，元の状態に戻す。" },
    { id: "ch9-0023", chapter: 9, term: "ロールフォワード", definition: "バックアップ＋更新後ログなどで，障害後に状態を進めて復旧する。" },

    { id: "ch9-0024", chapter: 9, term: "排他制御", definition: "複数トランザクションが同時更新しても矛盾が起きないようにする仕組み（ロック等）。" },
    { id: "ch9-0025", chapter: 9, term: "ロックの両立性", definition: "共有ロック同士など，複数トランザクションが同時にロックできる組合せの性質。" },
    { id: "ch9-0026", chapter: 9, term: "ロックの粒度", definition: "ロック対象の単位（表/ページ/行など）。" }
];