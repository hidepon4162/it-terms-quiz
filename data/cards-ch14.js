window.CARDS_CH14 = [
    {
        id: "ch14-0001", chapter: 14, term: "ネットワーク",
        definition: "複数のコンピュータや装置を接続し、データを相互にやり取りできる仕組み。",
        extraExplain: "暗記：繋がって通信できる仕組み"
    },
    {
        id: "ch14-0002", chapter: 14, term: "LAN",
        definition: "同一の建物内など、限定された狭い範囲で構築されるネットワーク。",
        extraExplain: "暗記：家や会社の中のネット"
    },
    {
        id: "ch14-0003", chapter: 14, term: "WAN",
        definition: "離れた場所にあるLAN同士を、通信事業者の回線を使って結んだ広域ネットワーク。",
        extraExplain: "暗記：都市間を結ぶ広いネット"
    },
    {
        id: "ch14-0004", chapter: 14, term: "プロトコル",
        definition: "通信を行うために決められた、共通の手順や約束事（規約）。",
        extraExplain: "暗記：通信の共通ルール"
    },
    {
        id: "ch14-0005", chapter: 14, term: "OSI参照モデル",
        definition: "国際標準化機構(ISO)が策定した、通信機能を7つの階層に分けて整理したモデル。",
        extraExplain: "暗記：通信の7階層モデル"
    },
    {
        id: "ch14-0006", chapter: 14, term: "第1層：物理層",
        definition: "コネクタの形状や電気信号など、物理的な接続を規定する層。",
        extraExplain: "暗記：電気信号とケーブル"
    },
    {
        id: "ch14-0007", chapter: 14, term: "第2層：データリンク層",
        definition: "隣接する機器間でのデータ転送（フレーム送信）と、MACアドレスによる制御を行う層。",
        extraExplain: "暗記：隣の機器への送信"
    },
    {
        id: "ch14-0008", chapter: 14, term: "第3層：ネットワーク層",
        definition: "IPアドレスを使い、異なるネットワーク間での経路選択（ルーティング）を行う層。",
        extraExplain: "暗記：ネットワーク間の経路決定"
    },
    {
        id: "ch14-0009", chapter: 14, term: "第4層：トランスポート層",
        definition: "データの到着確認や再送制御を行い、通信の信頼性を確保する層。",
        extraExplain: "ポイント: TCPやUDPがこの層で動きます。\n暗記：通信の信頼性確保"
    },
    {
        id: "ch14-0010", chapter: 14, term: "第5層：セッション層",
        definition: "通信の開始から終了（コネクションの確立・切断）までの一連の流れを管理する層。",
        extraExplain: "暗記：通信の開始と終了管理"
    },
    {
        id: "ch14-0011", chapter: 14, term: "第6層：プレゼンテーション層",
        definition: "文字コードの変換、データの圧縮・展開、暗号化などを行う層。",
        extraExplain: "暗記：データの形式変換"
    },
    {
        id: "ch14-0012", chapter: 14, term: "第7層：アプリケーション層",
        definition: "各アプリケーション（メール、Web閲覧など）固有のサービスを提供する層。",
        extraExplain: "暗記：ユーザーへのサービス提供"
    },
    {
        id: "ch14-0013", chapter: 14, term: "TCP/IP",
        definition: "現在のインターネットで標準的に使われている、4つの階層で構成される通信プロトコル群。",
        extraExplain: "暗記：ネットの標準プロトコル"
    },
    {
        id: "ch14-0014", chapter: 14, term: "IPアドレス",
        definition: "ネットワークに接続された各機器を識別するための「インターネット上の住所」。",
        extraExplain: "暗記：ネット上の住所"
    },
    {
        id: "ch14-0015", chapter: 14, term: "IPv4",
        definition: "32ビット（約43億個）でアドレスを表現する方式。現在、番号の枯渇が問題となっている。",
        extraExplain: "暗記：32ビットのアドレス"
    },
    {
        id: "ch14-0016", chapter: 14, term: "IPv6",
        definition: "128ビットでアドレスを表現する方式。実質的に無限のアドレスが利用可能。",
        extraExplain: "暗記：128ビットのアドレス"
    },
    {
        id: "ch14-0017", chapter: 14, term: "サブネットマスク",
        definition: "IPアドレスを、ネットワーク部（所属）とホスト部（個体）に分けるための数値。",
        extraExplain: "暗記：所属と個体の境界線"
    },
    {
        id: "ch14-0018", chapter: 14, term: "TCP",
        definition: "信頼性重視のプロトコル。相手と確認を取り合いながら、確実にデータを届ける。",
        extraExplain: "ポイント: HTTPやメールなどで使用。\n暗記：確実・丁寧な通信"
    },
    {
        id: "ch14-0019", chapter: 14, term: "UDP",
        definition: "速度・リアルタイム性重視のプロトコル。確認なしで一方的に送りつける。",
        extraExplain: "例: 動画配信、オンラインゲーム、電話など。\n暗記：速さ優先・送りっぱなし"
    },
    {
        id: "ch14-0020", chapter: 14, term: "ポート番号",
        definition: "1台のコンピュータ内で、どのアプリ（サービス）宛の通信かを識別する番号。",
        extraExplain: "例: HTTPなら80番、HTTPSなら443番。\n暗記：アプリごとの窓口番号"
    },
    {
        id: "ch14-0021", chapter: 14, term: "HTTP",
        definition: "Webサーバとブラウザの間で、HTMLなどのデータをやり取りするためのプロトコル。",
        extraExplain: "暗記：Web閲覧用"
    },
    {
        id: "ch14-0022", chapter: 14, term: "HTTPS",
        definition: "HTTPにSSL/TLSによる暗号化を加え、安全に通信を行えるようにしたもの。",
        extraExplain: "暗記：暗号化された安全なWeb"
    },
    {
        id: "ch14-0023", chapter: 14, term: "FTP",
        definition: "ネットワーク上でファイルを転送（アップロード、ダウンロード）するためのプロトコル。",
        extraExplain: "暗記：ファイル転送用"
    },
    {
        id: "ch14-0024", chapter: 14, term: "SMTP",
        definition: "電子メールを「送信」および「転送」するためのプロトコル。",
        extraExplain: "ひっかけ: 受信（POP3）との入れ替えに注意。\n暗記：メールの送信"
    },
    {
        id: "ch14-0025", chapter: 14, term: "POP3",
        definition: "サーバに届いた電子メールを「受信」するためのプロトコル。",
        extraExplain: "ポイント: 自分の端末にダウンロードして読む方式。\n暗記：メールの受信"
    },
    {
        id: "ch14-0026", chapter: 14, term: "DNS",
        definition: "「google.com」のようなドメイン名とIPアドレスを変換する（名前解決）仕組み。",
        extraExplain: "暗記：名前と住所の変換帳"
    },
    {
        id: "ch14-0027", chapter: 14, term: "ルータ",
        definition: "異なるネットワーク同士を接続し、IPアドレスを見てパケットの最適な経路を判断する装置。",
        extraExplain: "ポイント: OSIの第3層（ネットワーク層）で動作。\n暗記：ネットワークの交差点"
    },
    {
        id: "ch14-0028", chapter: 14, term: "L2スイッチ（スイッチングハブ）",
        definition: "MACアドレスを見て、特定の宛先だけにデータを転送する装置。",
        extraExplain: "ポイント: OSIの第2層（データリンク層）で動作。\n暗記：MACアドレスで交通整理"
    },
    {
        id: "ch14-0029", chapter: 14, term: "無線LAN",
        definition: "LANケーブルの代わりに電波を使って通信するネットワーク形態。Wi-Fiが代表的。",
        extraExplain: "暗記：ワイヤレスなネット接続"
    },
    {
        id: "ch14-0030", chapter: 14, term: "SSID",
        definition: "無線LANのアクセスポイントを識別するための名前（混線を防ぐ）。",
        extraExplain: "暗記：Wi-Fiの接続先名"
    },
    {
        id: "ch14-0031", chapter: 14, term: "帯域幅",
        definition: "通信に使用できる周波数の幅。一般には、通信速度（一度に送れる量）の最大値を指す。",
        extraExplain: "暗記：通信路の太さ"
    },
    {
        id: "ch14-0032", chapter: 14, term: "遅延（レイテンシ）",
        definition: "データが送信側から受信側に届くまでに発生する時間差。",
        extraExplain: "暗記：通信のタイムラグ"
    },
    {
        id: "ch14-0033", chapter: 14, term: "パケットロス",
        definition: "通信の途中でデータの一部が消失してしまう現象。通信品質の低下に繋がる。",
        extraExplain: "暗記：データの迷子・消失"
    }
];