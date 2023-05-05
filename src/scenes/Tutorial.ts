import GameStatus from "../constants/GameStatus";
import ImageKeys from "../constants/ImageKeys";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import GameBasicScene from "../extends/GameBasic";
import SceneParams from "../interfaces/SceneParams";

enum ArrowTypes {
    LEFT,
    BOTTOM,
    RIGHT,
    TOP,
};
interface TutorialScenario {
    id: number;             // チュートリアル固有番号
    message: string[];      // 表示するメッセージ
    isDispArrow: boolean;   // 矢印表示するかどうか
    arrow: ArrowTypes;      // 矢印の向き
    arrowX: number;         // 矢印のX
    arrowY: number;         // 矢印のY
    isEnding: boolean;      // 最後のメッセージなのか→ステージ終わるボタンなど表示
    prev: boolean;           // 前へボタン表示するか
    next: boolean;           // つぎへボタン表示するか
};

export default class TutorialScene extends GameBasicScene {
    // タイピングサウンド
    protected _typingSound!: Phaser.Sound.BaseSound;

    // チュートリアルで説明する箇所を指す矢印
    private _arrowText!: Phaser.GameObjects.Text;
    private _arrows: string[] = ['☜', '☟', '☞', '☝︎'];

    // つぎへボタン
    private _nextButton!: Phaser.GameObjects.Text;
    // 前へボタン
    private _prevButton!: Phaser.GameObjects.Text;

    // message
    private _messageText!: Phaser.GameObjects.Text;

    // tutorial
    private _tutorialScenario: TutorialScenario[] = [
        {
            id: 0,
            message: [
                "やっとここにきましたね！",
                "うれしいです！",
                "（せつめいをすすめるにはつぎへボタン）",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: false,
            next: true
        },
        {
            id: 1,
            message: [
                "まえよりがめんのひょうじがふえてますよね。",
                "じっせんでひょうじされるものです。",
                "",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 2,
            message: [
                "じっせんではこのメッセージがひょうじされ",
                "ないです。",
                "",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 3,
            message: [
                "AIをハッキングしようとすると",
                "ぎゃくにAIからこうげきをうけることになります。",
                "",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 4,
            message: [
                "なのでじっせんではAIのこうげきから",
                "まもることができたら、ぎゃくに",
                "ハッキングにせいこうすることになります。",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 5,
            message: [
                "AIのこうげきをがめんにシミュレーション",
                "していますのでつぎのステージでは",
                "AIのこうげきをまもるれんしゅうができます。",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 0,
            arrowY: 0,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 6,
            message: [
                "AIのこうげきはうえからです。",
                "うえのほうからにほんごのもじ、たんごが",
                "でてきます。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.TOP, // 0: left, 1: bottom, 2: right
            arrowX: 1320,
            arrowY: 100,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 7,
            message: [
                "うえからでてきたもじ、たんごは",
                "したにおちてきます。",
                "",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.BOTTOM, // 0: left, 1: bottom, 2: right
            arrowX: 960,
            arrowY: 780,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 8,
            message: [
                "このブロックのようなものは",
                "ファイアウォールといいます。",
                "もじ、たんごがここにぶつかると",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.BOTTOM, // 0: left, 1: bottom, 2: right
            arrowX: 960,
            arrowY: 780,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 9,
            message: [
                "たいりょくがへっていきます。",
                "みぎのENERGYとかいているところが",
                "たいりょくのひょうじです。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.RIGHT, // 0: left, 1: bottom, 2: right
            arrowX: 1520,
            arrowY: 100,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 10,
            message: [
                "たいりょくが０になると",
                "ハッキングしっぱいになりますので",
                "きをつけてください。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.RIGHT, // 0: left, 1: bottom, 2: right
            arrowX: 1520,
            arrowY: 100,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 11,
            message: [
                "そのしたのSCOREとひょうじされているところは",
                "てんすうでもくひょうてんすうになると",
                "ハッキングせいこうになります。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.RIGHT, // 0: left, 1: bottom, 2: right
            arrowX: 1520,
            arrowY: 220,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 12,
            message: [
                "ひだりのひょうじはいまどれぐらいの",
                "もじ、たんごがでているかをひょうじしています。",
                "",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: 320,
            arrowY: 220,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 13,
            message: [
                "いちばんしたはつかったことありますよね？",
                "ここにでてきたもじ、たんごをにゅうりょくして",
                "でてきたもじ、たんごをハッキングます。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.BOTTOM, // 0: left, 1: bottom, 2: right
            arrowX: 960,
            arrowY: 900,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 14,
            message: [
                "せいこうしたら、てんすうがあがります。",
                "にゅうりょくできるタイミングになったら、",
                "たてせんのカーソルがピコピコします。",
            ],
            isDispArrow: true,
            arrow: ArrowTypes.BOTTOM, // 0: left, 1: bottom, 2: right
            arrowX: 960,
            arrowY: 900,
            isEnding: false,
            prev: true,
            next: true
        },
        {
            id: 15,
            message: [
                "これでかんぺきです！",
                "じゅんびはできましたか？",
                "つぎにすすめましょう！",
            ],
            isDispArrow: false,
            arrow: ArrowTypes.LEFT, // 0: left, 1: bottom, 2: right
            arrowX: -1,
            arrowY: -1,
            isEnding: true,
            prev: true,
            next: false
        }
    ];
    // 現在のチュートリアル番号
    private _currentTId: number = 0;

    constructor() {
        super(SceneKeys.TUTORIAL);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate2(data);

        this.drawAttackCounter();
        this.drawStatusPannel();
        this.drawGamePannel();
        this.drawFirewall();
        this.drawTutorialParts();

        this.drawEnergyBar(10, 10);
        this.drawScoreBar(0, 10);

        // 最初は一部パーツを非活性化
        this._inputText.visible = false;
        this._arrowText.visible = false;
        this._nextButton.visible = false;
        this._prevButton.visible = false;
        
        // 初期アップデートを仕掛ける
        this._currentTId = 0; // 最初から再生
        this._gameStatus = GameStatus.IsPlaying;
        this._isUpdateRequire = true; // アップデートできるように

        // 該当ステージをノーマルステージにする
        this._saveDataManager.setNormal(this._stageInfo.stage);
    }

    update(_: number, _2: number): void {
        if (this._gameStatus === GameStatus.IsPlaying && this._isUpdateRequire) {
            // 初期化
            this._arrowText.visible = false;
            this._nextButton.visible = false;
            this._prevButton.visible = false;
            this._messageText.text = '';
            // メッセージ描画
            // 最後はアップデート制御
            if (this._currentTId < 0) {
                // シナリオの最後であればクリア
                this.physics.pause();
                this.scene.pause();
                this._sceneParameter.stage = this._stageInfo.stage;
                this._sceneParameter.isClear = true;
                this._sceneParameter.prevScene = SceneKeys.TUTORIAL;
                this.scene.launch(SceneKeys.RESULT, this._sceneParameter);
                // ステージクリアセット
                this._saveDataManager.setClear(this._stageInfo.stage);
                return;
            }
            const msg = this.getMessage(this._currentTId);
            this.typeDialogue(msg.join('\n'));
            this._isUpdateRequire = false;
        } 
    }

    partsControl(){
        const tutorial = this._tutorialScenario.find(child => child.id === this._currentTId) as TutorialScenario;

        // 前へボタン
        if (tutorial.prev) {
            this._prevButton.visible = true;
        }
        // つぎへボタン
        if (tutorial.next) {
            this._nextButton.visible = true;
        }
        // 矢印
        if (tutorial.isDispArrow) {
            this._arrowText.visible = true;
            this._arrowText.setText(this._arrows[tutorial.arrow]);
            this._arrowText.x = tutorial.arrowX;
            this._arrowText.y = tutorial.arrowY;
        }
        // 終わり
        if (tutorial.isEnding) {
            const endingButton = this.add.text(
                this.scale.width/2, this.scale.height/2,
                'じゅんびできた！',
                {
                    fontFamily: 'Noto Sans JP',
                    fontSize: '50px',
                    color: '#00ff00'
                }
            ).setOrigin(0.5, 0.5).setInteractive();
            endingButton.on('pointerover', () => {
                this._focusSound.play({rate: 2});
                endingButton.setColor('#ffff00');
                endingButton.setShadow(2, 2, '#006400', 2, true, true);
            }, this);
            endingButton.on('pointerout', () => {
                endingButton.setColor('#00ff00');
                endingButton.setShadow(2, 2, '#006400', 2, false, false);
            }, this);
            endingButton.on('pointerup', () => {
                this._currentTId=-1;
                this._gameStatus = GameStatus.IsPlaying;
                this._isUpdateRequire = true;
            }, this);
        }
    }

    typeDialogue(message: string) {
        const length = message.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this._typingSound.play({volume: 0.1, rate: 4});
                this._messageText.text += message[i];
                i++;
                if (i === length) {
                    // タイピングが終わったら
                    this.partsControl();
                }
            },
            repeat: length - 1,
            delay: 100,
        });
    }

    getMessage(tid: number) {
        const tutorial = this._tutorialScenario.find(child => child.id === tid) as TutorialScenario;
        return tutorial.message;
    }

    // チュートリアル用のパーツを描画
    drawTutorialParts() {
        // 矢印
        this._arrowText = this.add.text(
            this.scale.width/2, this.scale.height/2,
            '☜',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '100px',
                color: '#00ff00'
            }
        ).setOrigin(0.5, 0.5);
        this._arrowText.setDataEnabled();
        this._arrowText.setData('isOff', false);
        // つぎへボタン
        this._nextButton = this.add.text(
            this.scale.width/2 + 450, this.scale.height/2-200,
            'つぎへ＞',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '50px',
                color: '#00ff00'
            }
        ).setOrigin(0.5, 0.5).setInteractive();
        this._nextButton.on('pointerover', () => {
            this._focusSound.play({rate: 2});
            this._nextButton.setColor('#ffff00');
            this._nextButton.setShadow(2, 2, '#006400', 2, true, true);
        }, this);
        this._nextButton.on('pointerout', () => {
            this._nextButton.setColor('#00ff00');
            this._nextButton.setShadow(2, 2, '#006400', 2, false, false);
        }, this);
        this._nextButton.on('pointerup', () => {
            this._currentTId++;
            this._gameStatus = GameStatus.IsPlaying;
            this._isUpdateRequire = true;
        }, this);
        // 前へボタン
        this._prevButton = this.add.text(
            this.scale.width/2 - 450, this.scale.height/2-200,
            '＜まえへ',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '50px',
                color: '#00ff00'
            }
        ).setOrigin(0.5, 0.5).setInteractive();
        this._prevButton.on('pointerover', () => {
            this._focusSound.play({rate: 2});
            this._prevButton.setColor('#ffff00');
            this._prevButton.setShadow(2, 2, '#006400', 2, true, true);
        }, this);
        this._prevButton.on('pointerout', () => {
            this._prevButton.setColor('#00ff00');
            this._prevButton.setShadow(2, 2, '#006400', 2, false, false);
        }, this);
        this._prevButton.on('pointerup', () => {
            this._currentTId--;
            this._gameStatus = GameStatus.IsPlaying;
            this._isUpdateRequire = true;
        }, this);
        
        
        // 矢印ぴかぴか
        this.time.addEvent({
            callback: () => {
                if (this._arrowText.visible) {
                    const isOff = this._arrowText.getData('isOff') as boolean;
                    if (isOff) {
                        this._arrowText.setColor('#00ff00');
                        this._arrowText.setData('isOff', false);
                    } else {
                        this._arrowText.setColor('#006400');
                        this._arrowText.setData('isOff', true);
                    }
                }
            },
            callbackScope: this,
            loop: true,
            delay: 500,
        });

        // message
        const iconX = 500;
        const iconY = 100;
        this.add.image(iconX, iconY, ImageKeys.CHATTH_ICON).setScale(0.5, 0.5).setOrigin(0, 0);
        this.add.text(iconX + 35, iconY - 2, 'Chat-TH', {fontFamily: 'Noto Sans JP', fontSize: '30px', color: '#00ff00'});
        const box = this.add.graphics();
        box.fillStyle(0x003300, 1);
        box.fillRoundedRect(iconX + 5, iconY + 35, 700, 150, 5);
        box.fillStyle(0x006400, 1);
        box.fillRoundedRect(iconX, iconY + 30, 700, 150, 5);
        // メッセージテキストを作成しておく
        this._messageText = this.add.text(
            iconX + 20, iconY + 50, '',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '30px',
                color: '#00ff00',
            }
        );
        this._messageText.setShadow(1, 1, '#000000', 1, true, true);

        // Sound
        this._typingSound = this.sound.add(SoundKeys.TYPING);
    }
}