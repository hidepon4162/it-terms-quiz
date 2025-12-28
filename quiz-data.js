// quiz-data.js
const QUIZ_DATA = [
    {
        question: "連結リストの特徴として最も適切なものはどれか。",
        choices: [
            "参照も挿入も最速",
            "挿入・削除が速い",
            "常に整列される",
            "衝突が起きる"
        ],
        answer: 1,
        explanation: "連結リストはポインタの付け替えで済むため、挿入・削除が速い。"
    },
    {
        question: "有限小数の説明として正しいものはどれか。",
        choices: [
            "小数部が無限に続く",
            "小数部の桁数に限りがある",
            "必ず循環する",
            "2進数で表せない"
        ],
        answer: 1,
        explanation: "0.125 のように小数部が有限なもの。"
    },
    {
        question: "二分探索木の条件として正しいものはどれか。",
        choices: [
            "左 > 親 > 右",
            "左 < 親 < 右",
            "必ず完全二分木",
            "葉は同じ深さ"
        ],
        answer: 1,
        explanation: "左の子孫は小さく、右の子孫は大きい。"
    },
    {
        question: "クイックソートの基本手順はどれか。",
        choices: [
            "隣接要素を比較して交換",
            "基準値で分割し再帰的に整列",
            "FIFO順で並べる",
            "常に O(n)"
        ],
        answer: 1,
        explanation: "ピボットを基準に小さい群・大きい群へ分割する。"
    },
    {
        question: "半加算器で用いられる論理回路はどれか。",
        choices: [
            "OR と NOT",
            "AND と XOR",
            "NAND のみ",
            "XNOR のみ"
        ],
        answer: 1,
        explanation: "和は XOR、桁上がりは AND。"
    }
];