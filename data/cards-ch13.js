window.CARDS_CH13 = [
    {
        id: "ch13-0001",
        chapter: 13,
        term: "データベース (DB)",
        definition: "複数の利用者が共有し、再利用できるように、一定のルールで整理・蓄積されたデータの集まり。",
        extraExplain: "暗記：整理されたデータの基地"
    },
    {
        id: "ch13-0002",
        chapter: 13,
        term: "DBMS",
        definition: "データベースの定義、操作、管理を行う専用ソフト。データの整合性を保つ役割も担う。",
        extraExplain: "例: MySQL, Oracle。DB（箱）を管理する「管理人」。\n暗記：DB管理システム"
    },
    {
        id: "ch13-0003",
        chapter: 13,
        term: "表（テーブル）",
        definition: "関係データベースにおける、行と列で構成されるデータの基本単位。",
        extraExplain: "暗記：データの入れ物（表形式）"
    },
    {
        id: "ch13-0004",
        chapter: 13,
        term: "レコード",
        definition: "表の1行に相当する、1件分のデータのこと。",
        extraExplain: "例: 「田中さんの会員データ」という1つのまとまり。\n暗記：表の「行」"
    },
    {
        id: "ch13-0005",
        chapter: 13,
        term: "属性（カラム）",
        definition: "表の列に相当する、データ項目のこと。",
        extraExplain: "例: 「氏名」「住所」「電話番号」という項目。\n暗記：表の「列」"
    },
    {
        id: "ch13-0006",
        chapter: 13,
        term: "主キー (Primary Key)",
        definition: "表の中から特定の1行を一意に識別するための項目。重複と空（NULL）は禁止。",
        extraExplain: "例: 社員番号。世界に一つだけの識別番号。\n暗記：1行を特定する鍵"
    },
    {
        id: "ch13-0007",
        chapter: 13,
        term: "外部キー (Foreign Key)",
        definition: "他の表の主キーを参照している項目。表同士を関連付けるために使う。",
        extraExplain: "暗記：他所の主キーと繋ぐ鍵"
    },
    {
        id: "ch13-0008",
        chapter: 13,
        term: "関係データベース (RDB)",
        definition: "データを複数の表として管理し、表同士を関連付けて扱うデータベース方式。",
        extraExplain: "暗記：表形式のDB"
    },
    {
        id: "ch13-0009",
        chapter: 13,
        term: "正規化",
        definition: "データの重複をなくし、更新時の矛盾を防ぐために表を分割・整理する手法。",
        extraExplain: "暗記：重複排除と整理"
    },
    {
        id: "ch13-0010",
        chapter: 13,
        term: "第1正規形",
        definition: "1つのセルに複数の値を入れず（繰り返し項目の排除）、値を単一にした状態。",
        extraExplain: "暗記：繰り返し項目の排除"
    },
    {
        id: "ch13-0011",
        chapter: 13,
        term: "第2正規形",
        definition: "第1正規形であり、主キーの一部によって決まる項目を別表に分けた状態。",
        extraExplain: "ポイント: 複合主キーの一部に依存する項目を切り出す。\n暗記：部分関数従属の排除"
    },
    {
        id: "ch13-0012",
        chapter: 13,
        term: "第3正規形",
        definition: "第2正規形であり、主キー以外の項目によって決まる項目を別表に分けた状態。",
        extraExplain: "ポイント: 主キー→A→Bという連鎖的な決定関係（推移的）を解消する。\n暗記：推移的関数従属の排除"
    },
    {
        id: "ch13-0013",
        chapter: 13,
        term: "SQL",
        definition: "関係データベースの操作（検索・更新など）を行うための標準言語。",
        extraExplain: "暗記：DB操作の共通語"
    },
    {
        id: "ch13-0014",
        chapter: 13,
        term: "SELECT文",
        definition: "表から特定の列や行を検索して取得する、最も基本的なSQL文。",
        extraExplain: "暗記：データの検索・抽出"
    },
    {
        id: "ch13-0015",
        chapter: 13,
        term: "WHERE句",
        definition: "SELECT文などで、抽出する行の条件を指定する部分。",
        extraExplain: "例: WHERE 年齢 >= 20 （20歳以上を抽出）\n暗記：検索条件の指定"
    },
    {
        id: "ch13-0016",
        chapter: 13,
        term: "GROUP BY句",
        definition: "特定の列の値が同じレコードを、一つのグループにまとめる（集約する）指定。",
        extraExplain: "例: 部署ごとに合計金額を出す時などに使用。\n暗記：データのグループ化"
    },
    {
        id: "ch13-0017",
        chapter: 13,
        term: "HAVING句",
        definition: "GROUP BYでグループ化した後の結果に対して、さらに抽出条件を指定する部分。",
        extraExplain: "ひっかけ: WHEREは集約前、HAVINGは集約後。順番を問う問題に注意。\n暗記：集約後の条件指定"
    },
    {
        id: "ch13-0018",
        chapter: 13,
        term: "ビュー (仮想表)",
        definition: "実データは持たず、SELECT文の結果をあたかも一つの表のように見せる仕組み。",
        extraExplain: "暗記：中身のない架空の表"
    },
    {
        id: "ch13-0019",
        chapter: 13,
        term: "インデックス",
        definition: "特定の列に対して索引を作り、データ検索のスピードを劇的に上げる仕組み。",
        extraExplain: "ポイント: 検索は速くなるが、更新処理は少し遅くなる。\n暗記：検索高速化の索引"
    },
    {
        id: "ch13-0020",
        chapter: 13,
        term: "トランザクション",
        definition: "「これ以上分けられない」一連の処理単位。全成功か全失敗のどちらかになる。",
        extraExplain: "暗記：不可分な一連の処理"
    },
    {
        id: "ch13-0021",
        chapter: 13,
        term: "ACID特性",
        definition: "トランザクションが守るべき4つの性質（原子性・一貫性・独立性・永続性）。",
        extraExplain: "暗記：原子・一貫・独立・永続"
    },
    {
        id: "ch13-0022",
        chapter: 13,
        term: "ロールバック",
        definition: "エラー時に、トランザクション開始前の状態までデータを戻す処理。",
        extraExplain: "暗記：失敗時に元に戻す"
    },
    {
        id: "ch13-0023",
        chapter: 13,
        term: "コミット",
        definition: "トランザクションの全処理が成功したことを確定させ、DBに反映すること。",
        extraExplain: "暗記：処理結果の確定"
    }
];