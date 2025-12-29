window.CARDS_CH15 = [
    {
        id: "ch15-0001", chapter: 15, term: "情報セキュリティ",
        definition: "情報の機密性、完全性、可用性を維持すること。",
        extraExplain: "暗記：CIAを維持すること"
    },
    {
        id: "ch15-0002", chapter: 15, term: "機密性 (Confidentiality)",
        definition: "許可された人だけが情報にアクセスできることを確実にすること。",
        extraExplain: "対策: 暗号化、アクセス制限。\n暗記：秘密を守る"
    },
    {
        id: "ch15-0003", chapter: 15, term: "完全性 (Integrity)",
        definition: "情報が正確で、改ざんされていないことを確実にすること。",
        extraExplain: "対策: デジタル署名、ハッシュ値。\n暗記：正しさを保つ"
    },
    {
        id: "ch15-0004", chapter: 15, term: "可用性 (Availability)",
        definition: "必要な時にいつでも情報やサービスが利用できる状態にあること。",
        extraExplain: "対策: 二重化、UPS（無停電電源装置）。\n暗記：いつでも使える"
    },
    {
        id: "ch15-0005", chapter: 15, term: "脅威の分類",
        definition: "「物理的脅威（災害・破壊）」「技術的脅威（ウイルス・不正アクセス）」「人的脅威（誤操作・不正）」の3つ。",
        extraExplain: "暗記：モノ・ギジュツ・ヒト"
    },
    {
        id: "ch15-0006", chapter: 15, term: "ソーシャルエンジニアリング",
        definition: "人間の心理的な隙やミスに付け込んで、パスワードなどの秘密情報を盗み出す手口の総称。",
        extraExplain: "例: 肩越しにのぞき見る、清掃員を装って侵入するなど。\n暗記：人間をだます技術"
    },
    {
        id: "ch15-0007", chapter: 15, term: "なりすまし",
        definition: "正当な権限を持つ人のIDやパスワードを盗み、その人のふりをしてシステムを利用する行為。",
        extraExplain: "暗記：偽物による不正ログイン"
    },
    {
        id: "ch15-0008", chapter: 15, term: "ショルダーハッキング",
        definition: "パスワード入力などを背後から盗み見る行為。ソーシャルエンジニアリングの一種。",
        extraExplain: "暗記：肩越し（ショルダー）ののぞき見"
    },
    {
        id: "ch15-0009", chapter: 15, term: "不正のトライアングル",
        definition: "不正行為が発生する3要素「動機」「機会」「正当化」。",
        extraExplain: "暗記：きっかけ（動機）・チャンス（機会）・言い訳（正当化）"
    },
    {
        id: "ch15-0010", chapter: 15, term: "ポートスキャン",
        definition: "サーバに連続してアクセスし、開いているポートを調べて攻撃の隙（脆弱性）を探す調査行為。",
        extraExplain: "暗記：ドアが開いているか調べる"
    },
    {
        id: "ch15-0011", chapter: 15, term: "脆弱性（ぜいじゃくせい）",
        definition: "OSやソフトにある、セキュリティ上の欠陥や弱点。",
        extraExplain: "暗記：プログラムの弱点"
    },
    {
        id: "ch15-0012", chapter: 15, term: "セキュリティホール",
        definition: "設計ミスなどで生じた、セキュリティ上の致命的な欠陥（穴）。",
        extraExplain: "暗記：守備の穴"
    },
    {
        id: "ch15-0013", chapter: 15, term: "ブルートフォース攻撃",
        definition: "考えられるすべての組み合わせを順番に試す「総当たり攻撃」。",
        extraExplain: "暗記：力ずくの全パターン試行"
    },
    {
        id: "ch15-0014", chapter: 15, term: "辞書攻撃",
        definition: "辞書に載っている単語やよく使われるフレーズをリストにして試すパスワード攻撃。",
        extraExplain: "暗記：意味のある単語で攻める"
    },
    {
        id: "ch15-0015", chapter: 15, term: "パスワードリスト攻撃",
        definition: "他所で流出したIDとパスワードのリストを使い、別のサイトでログインを試みる攻撃。",
        extraExplain: "ポイント: ユーザーが「パスワードを使い回している」ことを悪用します。\n暗記：リストで使い回しを狙う"
    },
    {
        id: "ch15-0016", chapter: 15, term: "マルウェア",
        definition: "ウイルス、ワーム、トロイの木馬など、悪意を持って作られたソフトの総称。",
        extraExplain: "暗記：悪意のあるソフト全部"
    },
    {
        id: "ch15-0017", chapter: 15, term: "ボット (BOT)",
        definition: "感染したPCを、攻撃者が外部から遠隔操作できるようにするマルウェア。",
        extraExplain: "ポイント: 多数のボットによる攻撃を「DDoS攻撃」と呼びます。\n暗記：遠隔操作されるゾンビPC"
    },
    {
        id: "ch15-0018", chapter: 15, term: "スパイウェア",
        definition: "PC内の個人情報や操作履歴を勝手に収集し、外部に送信するマルウェア。",
        extraExplain: "暗記：こっそり情報を盗む"
    },
    {
        id: "ch15-0019", chapter: 15, term: "ランサムウェア",
        definition: "データを勝手に暗号化して使えなくし、復元のために「身代金」を要求するマルウェア。",
        extraExplain: "暗記：身代金要求型ウイルス"
    },
    {
        id: "ch15-0020", chapter: 15, term: "キーロガー",
        definition: "キーボードからの入力をすべて記録するソフト。パスワード奪取に使われる。",
        extraExplain: "暗記：入力履歴をログに記録"
    },
    {
        id: "ch15-0021", chapter: 15, term: "バックドア",
        definition: "一度侵入した後に、次回から簡単に再侵入できるように隠して作る「裏口」。",
        extraExplain: "暗記：秘密の裏口"
    },
    {
        id: "ch15-0022", chapter: 15, term: "フィッシング",
        definition: "偽のメールやサイトで銀行やECサイトを装い、クレカ番号などを盗む詐欺。",
        extraExplain: "暗記：偽サイトへ釣り上げる"
    },
    {
        id: "ch15-0023", chapter: 15, term: "ドライブバイダウンロード",
        definition: "Webサイトを閲覧しただけで、勝手にマルウェアがダウンロード・感染させられる攻撃。",
        extraExplain: "暗記：見ただけで感染"
    },
    {
        id: "ch15-0024", chapter: 15, term: "SEOポイズニング",
        definition: "検索エンジンの結果上位に、悪意のあるサイトが表示されるように細工する手口。",
        extraExplain: "暗記：検索結果を毒で汚染"
    },
    {
        id: "ch15-0025", chapter: 15, term: "DNSキャッシュポイズニング",
        definition: "DNSサーバに偽のIPアドレス情報を覚え込ませ、偽サイトへ誘導する攻撃。",
        extraExplain: "暗記：ネットの電話帳を書き換える"
    },
    {
        id: "ch15-0026", chapter: 15, term: "SQLインジェクション",
        definition: "入力フォームに不正なSQL文を注入し、データベースを不正に操作する攻撃。",
        extraExplain: "暗記：DBへの命令を流し込む"
    },
    {
        id: "ch15-0027", chapter: 15, term: "クロスサイトスクリプティング (XSS)",
        definition: "Webサイトの掲示板などに悪意のあるスクリプトを埋め込み、閲覧者のCookieなどを盗む攻撃。",
        extraExplain: "暗記：閲覧者のブラウザで実行"
    },
    {
        id: "ch15-0028", chapter: 15, term: "ディレクトリトラバーサル",
        definition: "ファイルパスの指定方法を悪用し、本来アクセスできない階層のファイルを参照する攻撃。",
        extraExplain: "暗記：階層を遡ってのぞき見"
    },
    {
        id: "ch15-0029", chapter: 15, term: "スパムメール",
        definition: "宣伝などの目的で、受信者の承諾なく一方的に送りつけられる迷惑メール。",
        extraExplain: "暗記：一方的な迷惑メール"
    },
    {
        id: "ch15-0030", chapter: 15, term: "DoS攻撃 / DDoS攻撃",
        definition: "大量のデータを送りつけて、ターゲットのサーバをダウンさせる攻撃。（Dが付くと複数台からの一斉攻撃）",
        extraExplain: "暗記：サービス妨害攻撃"
    },
    {
        id: "ch15-0031", chapter: 15, term: "共通鍵暗号方式",
        definition: "暗号化と復号に「同じ鍵」を使う方式。処理は早いが、鍵の配送に工夫が必要。",
        extraExplain: "例: AES。鍵を秘密に共有する必要がある。\n暗記：同じ鍵で開け閉め"
    },
    {
        id: "ch15-0032", chapter: 15, term: "公開鍵暗号方式",
        definition: "暗号化に「公開鍵」、復号に「秘密鍵」という異なるペアの鍵を使う方式。",
        extraExplain: "ポイント: 公開鍵で誰でも暗号化できるが、復号できるのは持ち主だけ。\n暗記：ペアの鍵で別々に"
    },
    {
        id: "ch15-0033", chapter: 15, term: "ハイブリッド暗号方式",
        definition: "データ本体は共通鍵で（高速）、その共通鍵を公開鍵で（安全）送る、いいとこ取りの方式。",
        extraExplain: "暗記：速さと安全の両立"
    },
    {
        id: "ch15-0034", chapter: 15, term: "AES",
        definition: "現在主流の、非常に強力な共通鍵暗号アルゴリズム。",
        extraExplain: "暗記：世界標準の共通鍵"
    },
    {
        id: "ch15-0035", chapter: 15, term: "RSA",
        definition: "大きな数の素因数分解が困難なことを利用した、代表的な公開鍵暗号アルゴリズム。",
        extraExplain: "暗記：素因数分解の公開鍵"
    },
    {
        id: "ch15-0036", chapter: 15, term: "ハッシュ関数",
        definition: "入力データから、固定長の短い数値（メッセージダイジェスト）を生成する関数。逆算や復元は不可能。",
        extraExplain: "用途: 改ざん検知、パスワード保存。\n暗記：指紋のような短い値"
    },
    {
        id: "ch15-0037", chapter: 15, term: "SHA-256",
        definition: "現在広く使われているハッシュ関数のアルゴリズム名。",
        extraExplain: "暗記：代表的なハッシュ"
    },
    {
        id: "ch15-0038", chapter: 15, term: "デジタル署名",
        definition: "「送信者の秘密鍵」で作成し、「送信者の公開鍵」で検証する。本人の証明と改ざん防止が可能。",
        extraExplain: "ひっかけ: 暗号化とは「使う鍵」が逆になるため注意！\n暗記：本人証明と改ざん検知"
    },
    {
        id: "ch15-0039", chapter: 15, term: "認証局 (CA)",
        definition: "デジタル証明書を発行する信頼できる第三者機関。公開鍵の正当性を証明する。",
        extraExplain: "暗記：ネットの身分証明書発行所"
    },
    {
        id: "ch15-0040", chapter: 15, term: "リスクマネジメント",
        definition: "リスクの特定 → 分析 → 評価 → 対応 という一連の管理プロセス。",
        extraExplain: "暗記：リスクのトータル管理"
    },
    {
        id: "ch15-0041", chapter: 15, term: "リスク回避",
        definition: "リスクのある業務や活動そのものをやめること。",
        extraExplain: "例: 危険な国での事業を撤退する。\n暗記：リスクの元を断つ"
    },
    {
        id: "ch15-0042", chapter: 15, term: "リスク低減",
        definition: "セキュリティ対策を行い、リスクの発生確率や影響度を下げること。",
        extraExplain: "例: ウイルス対策ソフトを導入する。\n暗記：被害を小さくする"
    },
    {
        id: "ch15-0043", chapter: 15, term: "リスク共有 (移転)",
        definition: "保険に入ったり外部委託したりして、他者にリスクを肩代わりしてもらうこと。",
        extraExplain: "例: サイバー保険に加入する。\n暗記：他人に分担してもらう"
    },
    {
        id: "ch15-0044", chapter: 15, term: "リスク保有",
        definition: "リスクの影響が小さい場合などに、特に対策せず、許容範囲内として受け入れること。",
        extraExplain: "暗記：リスクをそのまま持つ"
    },
    {
        id: "ch15-0045", chapter: 15, term: "ファイアウォール",
        definition: "外部ネットワーク（ネット）と内部（LAN）の間で、通していい通信か判断し、不正な侵入を防ぐ壁。",
        extraExplain: "暗記：通信の防火壁"
    },
    {
        id: "ch15-0046", chapter: 15, term: "WAF (Web Application Firewall)",
        definition: "Webアプリケーションへの攻撃（SQLiやXSSなど）に特化して防ぐ装置。",
        extraExplain: "暗記：Webアプリ用の壁"
    },
    {
        id: "ch15-0047", chapter: 15, term: "DMZ (非武装地帯)",
        definition: "外部（ネット）と内部（LAN）のどちらからも隔離された、Webサーバなどを置く中間エリア。",
        extraExplain: "暗記：外部公開用の隔離部屋"
    },
    {
        id: "ch15-0048", chapter: 15, term: "SSL / TLS",
        definition: "ブラウザとWebサーバ間の通信を暗号化するプロトコル。HTTPSで利用される。",
        extraExplain: "暗記：ネット通信の暗号化"
    },
    {
        id: "ch15-0049", chapter: 15, term: "BYOD",
        definition: "従業員が個人の私物スマホやPCを、会社の業務に使用すること。",
        extraExplain: "暗記：私物の業務利用"
    },
    {
        id: "ch15-0050", chapter: 15, term: "MDM (Mobile Device Management)",
        definition: "会社が配布した大量のスマホやタブレットを一括設定・管理する仕組み。",
        extraExplain: "暗記：モバイル端末の一元管理"
    },
    {
        id: "ch15-0051", chapter: 15, term: "ペネトレーションテスト",
        definition: "実際にシステムへ攻撃を仕掛けてみて、侵入できないか試す安全評価テスト。",
        extraExplain: "暗記：侵入（テスト）攻撃"
    },
    {
        id: "ch15-0052", chapter: 15, term: "セキュアブート",
        definition: "PC起動時にOSの署名を確認し、不正なプログラムが動かないようにする仕組み。",
        extraExplain: "暗記：安全なOS起動"
    },
    {
        id: "ch15-0053", chapter: 15, term: "CAPTCHA (キャプチャ)",
        definition: "ゆがんだ文字を読ませるなどして、操作しているのが人間かロボットかを判別する仕組み。",
        extraExplain: "暗記：人間かどうかのテスト"
    },
    {
        id: "ch15-0054", chapter: 15, term: "認証の3要素",
        definition: "「知識（記憶）」「所有（持っているもの）」「生体（体の一部）」の3つ。",
        extraExplain: "暗記：知っている・持っている・自分自身"
    },
    {
        id: "ch15-0055", chapter: 15, term: "二要素認証",
        definition: "パスワード（知識）とスマホ通知（所有）など、異なる2つの要素を組み合わせて認証すること。",
        extraExplain: "暗記：2つの要素で二重チェック"
    },
    {
        id: "ch15-0056", chapter: 15, term: "バイオメトリクス認証 (生体認証)",
        definition: "指紋、顔、虹彩（目の模様）、静脈などの身体的特徴を利用した認証方式。",
        extraExplain: "暗記：体の一部で認証"
    },
    {
        id: "ch15-0057", chapter: 15, term: "FAR (他人受入率)",
        definition: "他人を誤って本人と判定し、許可してしまう確率。低いほどセキュリティが高い（厳しい）。",
        extraExplain: "暗記：他人を入れちゃう間違い"
    },
    {
        id: "ch15-0058", chapter: 15, term: "FRR (本人拒否率)",
        definition: "本人を誤って他人と判定し、拒否してしまう確率。低いほど利便性が高い（優しい）。",
        extraExplain: "暗記：本人を断っちゃう間違い"
    }
];