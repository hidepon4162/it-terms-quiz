window.CARDS_CH11 = [
    { id: "ch11-0001", chapter: 11, term: "脅威の分類（例）", definition: "情報セキュリティの脅威は人的・技術的・物理的などに分類できる。" },
    { id: "ch11-0002", chapter: 11, term: "ソーシャルエンジニアリング", definition: "特別なツールや技術ではなく、人間心理を利用して機密情報を得る手法（例：管理者を装ってPWを聞き出す）。" },

    { id: "ch11-0003", chapter: 11, term: "不正のトライアングル", definition: "不正が起きる要因：機会（環境）・動機・正当化の3条件。" },

    { id: "ch11-0004", chapter: 11, term: "ポートスキャン", definition: "攻撃できそうなサービス（開いているポート等）があるかを調べる事前調査。" },
    { id: "ch11-0005", chapter: 11, term: "セキュリティホール", definition: "システムに存在する欠陥（脆弱性）。" },

    { id: "ch11-0006", chapter: 11, term: "ブルートフォース攻撃", definition: "可能な文字列の全組合せを総当たりで試す攻撃。" },
    { id: "ch11-0007", chapter: 11, term: "辞書攻撃", definition: "辞書に載っている単語等を試す攻撃。" },
    { id: "ch11-0008", chapter: 11, term: "パスワードリスト攻撃", definition: "流出したIDとパスワードの組を別サービスで試す攻撃（使い回し狙い）。" },

    { id: "ch11-0009", chapter: 11, term: "マルウェア", definition: "悪意のあるソフトウェアの総称。" },
    { id: "ch11-0010", chapter: 11, term: "ボット", definition: "攻撃者の遠隔指令を受けて動作するプログラム。" },
    { id: "ch11-0011", chapter: 11, term: "スパイウェア", definition: "利用者に気づかれないように情報収集するマルウェア。" },
    { id: "ch11-0012", chapter: 11, term: "ランサムウェア", definition: "データを利用不能にするなどして身代金を要求するマルウェア。" },
    { id: "ch11-0013", chapter: 11, term: "キーロガー", definition: "キーボード入力を記録し、情報を盗むマルウェア。" },
    { id: "ch11-0014", chapter: 11, term: "バックドア", definition: "正規の認証を回避できる侵入口など、隠された仕掛け。" },

    { id: "ch11-0015", chapter: 11, term: "フィッシング", definition: "偽サイトへ誘導し、個人情報などを不正取得する攻撃。" },
    { id: "ch11-0016", chapter: 11, term: "ドライブバイダウンロード", definition: "Web閲覧だけでマルウェアがダウンロードされる攻撃。" },
    { id: "ch11-0017", chapter: 11, term: "SEOポイズニング", definition: "検索結果上位に悪意あるサイトを表示させ、誘導する手法。" },
    { id: "ch11-0018", chapter: 11, term: "DNSキャッシュポイズニング", definition: "DNSキャッシュを書き換え、偽サイト等へ誘導する攻撃。" },
    { id: "ch11-0019", chapter: 11, term: "SQLインジェクション", definition: "入力に不正SQLを混ぜ、DB改ざん・情報漏えい等を狙う攻撃。" },
    { id: "ch11-0020", chapter: 11, term: "クロスサイトスクリプティング（XSS）", definition: "悪意あるスクリプトを埋め込み、Cookie窃取などを狙う攻撃。" },

    { id: "ch11-0021", chapter: 11, term: "スパムメール", definition: "受信者の承諾なしに無差別送信される迷惑メール。" },
    { id: "ch11-0022", chapter: 11, term: "DoS攻撃", definition: "サービス提供不能にするために過負荷を与える攻撃。" },
    { id: "ch11-0023", chapter: 11, term: "ディレクトリトラバーサル", definition: "管理者が意図しないファイルへ到達して閲覧等を狙う攻撃。" },

    { id: "ch11-0024", chapter: 11, term: "共通鍵暗号方式", definition: "暗号化と復号に同じ鍵を使う方式（高速）。" },
    { id: "ch11-0025", chapter: 11, term: "公開鍵暗号方式", definition: "公開鍵で暗号化し、秘密鍵で復号する方式（一般に遅い）。" },
    { id: "ch11-0026", chapter: 11, term: "ハイブリッド暗号方式", definition: "共通鍵を公開鍵暗号で安全に送り、本文データは共通鍵暗号で暗号化・復号する方式。" },
    { id: "ch11-0027", chapter: 11, term: "AES", definition: "代表的な共通鍵暗号アルゴリズム。" },
    { id: "ch11-0028", chapter: 11, term: "RSA", definition: "巨大数の素因数分解が困難である性質を利用した公開鍵暗号アルゴリズム。" },

    { id: "ch11-0029", chapter: 11, term: "SHA-256", definition: "256ビット長のダイジェストを出力するハッシュ関数アルゴリズム。" },

    { id: "ch11-0030", chapter: 11, term: "デジタル署名", definition: "送信者がダイジェストを秘密鍵で署名し、受信者が公開鍵で検証する。なりすまし・改ざん検知に有効。" },
    { id: "ch11-0031", chapter: 11, term: "認証局（CA）", definition: "利用者・サーバの公開鍵を証明するデジタル証明書を発行する機関。" },

    { id: "ch11-0032", chapter: 11, term: "リスクマネジメントの流れ", definition: "リスク特定→リスク分析→リスク評価→リスク対応。" },
    { id: "ch11-0033", chapter: 11, term: "リスク対応（4分類）", definition: "回避（やらない）・低減（確率/影響を下げる）・共有（移転/保険等）・保有（受け入れる）。" },

    { id: "ch11-0034", chapter: 11, term: "機密性", definition: "認められた人だけが情報にアクセスできること。" },
    { id: "ch11-0035", chapter: 11, term: "完全性", definition: "情報が改ざんされていないこと。" },
    { id: "ch11-0036", chapter: 11, term: "可用性", definition: "必要なときに情報やサービスを利用できること。" },

    { id: "ch11-0037", chapter: 11, term: "ファイアウォール", definition: "外部からの不正アクセスを制御し、内部ネットワークを保護する仕組み。" },
    { id: "ch11-0038", chapter: 11, term: "WAF", definition: "Webアプリの脆弱性を狙う攻撃から保護する仕組み。" },
    { id: "ch11-0039", chapter: 11, term: "DMZ", definition: "外部と内部の両方から分離された中間領域のネットワーク。" },
    { id: "ch11-0040", chapter: 11, term: "SSL/TLS", definition: "クライアントとサーバ間の通信を暗号化するプロトコル群。" },

    { id: "ch11-0041", chapter: 11, term: "BYOD", definition: "従業員が私物端末を業務に利用すること。" },
    { id: "ch11-0042", chapter: 11, term: "MDM", definition: "業務端末をセキュリティポリシーに従って一元管理すること。" },

    { id: "ch11-0043", chapter: 11, term: "ペネトレーションテスト", definition: "実際に攻撃を試み、侵入できるかを検証する手法。" },
    { id: "ch11-0044", chapter: 11, term: "セキュアブート", definition: "起動時にOS等の署名を検証し、改ざんソフトの起動を防ぐ仕組み。" },
    { id: "ch11-0045", chapter: 11, term: "CAPTCHA", definition: "操作主体が人間かどうかを判定するテスト。" },

    { id: "ch11-0046", chapter: 11, term: "HDD廃棄時の対策", definition: "ランダムデータで全領域を複数回上書きするなどで漏えいを防ぐ。" },
    { id: "ch11-0047", chapter: 11, term: "行動的特徴（生体認証）", definition: "署名速度や筆圧など、行動パターンから特徴を抽出して認証する。" },
    { id: "ch11-0048", chapter: 11, term: "バイオメトリクス調整の観点", definition: "本人拒否率（FRR）と他人受入率（FAR）の両方を考慮して閾値を調整する。" },
    { id: "ch11-0049", chapter: 11, term: "2要素認証", definition: "記憶・所有物・生体情報の3要素のうち2つで本人確認する方式。" }
];