import SceneKeys from "../constants/SceneKeys";
import BasicScene from "../extends/Basic";
import SceneParams from "../interfaces/SceneParams";

export default class AboutScene extends BasicScene {
    constructor() {
        super(SceneKeys.ABOUT);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate(data);

        this.add.text(this.scale.width/2, 50, [
            'タイピング・ヒーローをプレーしていただき、',
            'ありがとうございます。',
            '日本語においてタイピングとは',
            '表現したい日本語にしっかり変換して',
            'タイピングすることが大事だと思います。',
            'そのため、日本語変換をする、',
            'タイピング練習ができるゲームを制作しました。',
            'タイピング・ヒーローに使用している単語は次になります。',
            '',
            '1. ひらがな、カタカナの文字',
            '',
            '2. ひらがな、カタカナの単語（小学校過程の語彙）',
            '',
            '3. 小学校で学ぶ漢字の単語',
            '',
            'ステージを進むにつれて新しい文字、単語が出現させています。',
            '','',
            'セーブデータはブラウザの中に保存されます。',
            'ブラウザ設定により、セーブデータが初期化される可能性があります。',
            'セーブデータの移行、復元などの機能は実装しておりませんので',
            'ご了承ください。',
            '',
            'Special Thanks',
            '効果音ラボ様より効果音をご提供いただきました。',
            '効果音ラボ',
            'https://soundeffect-lab.info/',
            'ご提供、ありいがとうございます。',
        ],{
            fontFamily: 'Noto Sans JP',
            fontSize: '23px',
            color: '#00ff00',
            align: 'center',
        }).setOrigin(0.5, 0);

        this.drawButton(this.scale.width/2+520, 850, 'もどる', 30, SceneKeys.TITLE, true);
    }
}