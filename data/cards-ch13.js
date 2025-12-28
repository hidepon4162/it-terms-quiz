// cards-ch13.js
window.CARDS_CH13 = [
    { id: "ch13-0001", term: "データベース", definition: "複数のアプリケーションから共有して利用できるように，整理・統合して蓄積されたデータの集合。" },

    { id: "ch13-0002", term: "DBMS", definition: "Database Management System。データベースの定義・操作・管理を行うソフトウェア。" },

    { id: "ch13-0003", term: "表（テーブル）", definition: "行（レコード）と列（属性）で構成される，関係データベースの基本構造。" },
    { id: "ch13-0004", term: "レコード", definition: "表の1行に相当する，1件分のデータ。" },
    { id: "ch13-0005", term: "属性（カラム）", definition: "表の列に相当する，データ項目。" },

    { id: "ch13-0006", term: "主キー", definition: "表中の各レコードを一意に識別するための属性。" },
    { id: "ch13-0007", term: "外部キー", definition: "他の表の主キーを参照する属性。表同士の関連付けに用いる。" },

    { id: "ch13-0008", term: "関係データベース", definition: "データを表（テーブル）として管理し，表同士の関係でデータを扱うデータベース。" },

    { id: "ch13-0009", term: "正規化", definition: "データの重複や更新異常を防ぐために，表を分割・整理する設計手法。" },
    { id: "ch13-0010", term: "第1正規形", definition: "1つの属性に1つの値だけを持たせ，繰り返し項目を排除した状態。" },
    { id: "ch13-0011", term: "第2正規形", definition: "部分関数従属を排除した状態。" },
    { id: "ch13-0012", term: "第3正規形", definition: "推移的関数従属を排除した状態。" },

    { id: "ch13-0013", term: "SQL", definition: "Structured Query Language。データベースを操作するための標準言語。" },
    { id: "ch13-0014", term: "SELECT文", definition: "表から条件に合うデータを検索・取得するSQL文。" },
    { id: "ch13-0015", term: "WHERE句", definition: "検索条件を指定する句。" },
    { id: "ch13-0016", term: "GROUP BY句", definition: "データをグループ化する句。" },
    { id: "ch13-0017", term: "HAVING句", definition: "グループ化した結果に対する条件を指定する句。" },

    { id: "ch13-0018", term: "ビュー", definition: "SELECT文の結果を仮想的な表として扱う仕組み。" },
    { id: "ch13-0019", term: "インデックス", definition: "検索を高速化するために作成する索引構造。" },

    { id: "ch13-0020", term: "トランザクション", definition: "一連の処理をまとめた不可分な処理単位。" },
    { id: "ch13-0021", term: "ACID特性", definition: "トランザクションが備えるべき4特性（原子性・一貫性・独立性・永続性）。" },

    { id: "ch13-0022", term: "ロールバック", definition: "トランザクションを開始前の状態に戻す処理。" },
    { id: "ch13-0023", term: "コミット", definition: "トランザクションの処理結果を確定すること。" }
];