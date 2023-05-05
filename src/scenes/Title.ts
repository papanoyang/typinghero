import SceneKeys from "../constants/SceneKeys";
import BasicScene from "../extends/Basic";
import SceneParams from "../interfaces/SceneParams";

export default class TitleScene extends BasicScene {
    // 壁に表示する文字セット
    private _characterSet = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", 
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ", "わ", "を", "ん",
        "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ",
        "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ",
        "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
        "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", 
        "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", 
        "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", 
        "ヤ", "ユ", "ヨ", 
        "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", 
        "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", 
        "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", 
        "パ", "ピ", "プ", "ペ", "ポ", 
    ];

    private _characterColors = [
        '#000000','#001100','#022000','#003300','#004400',
        '#005500','#006600','#007700','#008800','#009900',
        '#00ff00','#009900','#008800','#007700','#006600',
        '#005500','#004400','#003300','#022000','#001100',
        '#000000',
    ];
    // 文字のグループ
    private _characterGroup!: Phaser.GameObjects.Group;

    // down speed
    private _speed: number = 0;
    // layer
    private _backLayer!: Phaser.GameObjects.Layer;

    constructor() {
        super(SceneKeys.TITLE);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate(data);

        // layer
        this._backLayer = this.add.layer();
        // 背景の文字雨のグループ
        this._characterGroup = this.add.group();
        
        // title
        this.drawTitle();

        // Start Button
        // 初めての実行ならステージ１へ
        if (this._saveDataManager.isFirst()) {
            // ステージ１へ
            this._sceneParameter.stage = 1;
            this.drawButton(this.scale.width/2, 800, 'はじめる', 50, SceneKeys.TRAINING, true);
        } else {
            this.drawButton(this.scale.width/2, 800, 'はじめる', 50, SceneKeys.STAGE, true);
        }

        // スピード計算、画面縦の900ピクセルを設定の秒数で移動するスピード
        this._speed = Phaser.Math.GetSpeed(900, 5);

        // 文字雨を降らせる
        this.time.addEvent({
            delay: 10,
            callbackScope: this,
            loop: true,
            callback: () => {
                this.spawnCharRain();
            }
        });
        // 文字雨の色を変化させる
        this.time.addEvent({
            delay: 80,
            callbackScope: this,
            loop: true,
            callback: () => {
                this._characterGroup.children.each(child => {
                    const charRain = child as Phaser.GameObjects.Text;
                    let colorIndex = charRain.getData('color') as number;
                    colorIndex++;
                    if (colorIndex >= this._characterColors.length) {
                        colorIndex = 0; 
                    }
                    charRain.setColor(this._characterColors[colorIndex]);
                    charRain.setData('color', colorIndex);
                    return true;
                },this);
            },
        });

        this.drawButton(this.scale.width/2 + 430, 860, 'タイピング・ヒーローについて', 20, SceneKeys.ABOUT, true);
    }

    update(_: number, delta: number): void {
        this._characterGroup.children.each(child => {
            const charRain = child as Phaser.GameObjects.Text;
            charRain.y += this._speed * delta;
            charRain.rotation += 0.01;

            if (charRain.y > 865) {
                charRain.destroy();
            }
            return true;
        }, this);
    }

    private spawnCharRain() {
        const charIndex = Phaser.Math.Between(0, this._characterSet.length-1);
        const colorIndex = Phaser.Math.Between(0, this._characterColors.length-1);
        const charRain = this.add.text(
            this.scale.width/2, 0,
            this._characterSet[charIndex],
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '23px',
                color: this._characterColors[colorIndex],
            }
        ).setOrigin(0.5, 0.5);
        const x = Phaser.Math.Between(380 + charRain.width/2, 1520 - charRain.width/2);
        const y = charRain.height/2 + 20;
        charRain.x = x;
        charRain.y = y;
        charRain.setDataEnabled();
        charRain.setData('color', colorIndex);
        this._characterGroup.add(charRain);
        this._backLayer.add(charRain);
    }

    private drawTitle() {
        const shadow = this.add.text(
            this.scale.width/2+4,
            304,
            'Typing Hero',{
                fontFamily: 'Russo One',
                fontStyle: 'bold',
                fontSize: '100px',
                color: '#000000'
        }).setOrigin(0.5, 0.5);
        shadow.setStroke('#00ff00', 5);
        this.add.text(
            this.scale.width/2,
            300,
            'Typing Hero',{
                fontFamily: 'Russo One',
                fontStyle: 'bold',
                fontSize: '100px',
                color: '#00ff00'
        }).setOrigin(0.5, 0.5);
        const shadow2 = this.add.text(
            this.scale.width/2 + 4,
            404,
            'タイピング・ヒーロー',{
                fontFamily: 'Noto Sans JP',
                fontStyle: 'bold',
                fontSize: '45px',
                color: '#000000'
        }).setOrigin(0.5, 0.5);
        shadow2.setStroke('#00ff00', 4);
        this.add.text(
            this.scale.width/2,
            400,
            'タイピング・ヒーロー',{
                fontFamily: 'Noto Sans JP',
                fontStyle: 'bold',
                fontSize: '45px',
                color: '#00ff00'
        }).setOrigin(0.5, 0.5);
    }
}