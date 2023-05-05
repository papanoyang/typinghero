import InputText from "phaser3-rex-plugins/plugins/inputtext";
import AnimationKeys from "../constants/AnimationKeys";
import GameStatus from "../constants/GameStatus";
import ImageKeys from "../constants/ImageKeys";
import SceneKeys from "../constants/SceneKeys";
import GameBasicScene from "../extends/GameBasic";
import SceneParams from "../interfaces/SceneParams";

export default class GameScene extends GameBasicScene {
    // down speed
    private _speed: number = 0;

    // spawn timer
    private _spawnTimer!: Phaser.Time.TimerEvent;

    // enemy group
    private _enemyGroup!: Phaser.GameObjects.Group;

    // countdown
    private _countdownTime!: number;
    private _countdownText!: Phaser.GameObjects.Text;
    private _countdownTimer!: Phaser.Time.TimerEvent;

    // character color
    private _characterColors = ['#001100', '#002200', '#003300', '#004400', '#005500', '#006600', '#007700', '#008800', '#009900', '#00aa00', '#00bb00', '#00cc00', '#00dd00', '#00ee00', '#00ff00'];

    constructor() {
        super(SceneKeys.GAME);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate2(data);
        this.loadEnemyData();

        this.drawAttackCounter();
        this.drawStatusPannel();
        this.drawGamePannel();
        this.drawFirewall();

        // 各種ステータス初期化
        this._energyMax = this._stageInfo.energy;
        this._energyCurrent = this._energyMax;
        this._scoreMax = this._stageInfo.clearScore;
        this._scoreCurrent = 0;
        this.drawEnergyBar(this._energyCurrent, this._energyMax);
        this.drawScoreBar(this._scoreCurrent, this._scoreMax);
        this._attackCounter = 0;

        // スピード計算、画面縦の900ピクセルを設定の秒数で移動するスピード
        this._speed = Phaser.Math.GetSpeed(900, this._stageInfo.enemySpeed);

        // 初期カウントダウンの準備
        this._enemyGroup = this.add.group();
        this._gameStatus = GameStatus.IsNone;
        this._isUpdateRequire = true;
        this._inputText.on('keyup', this.enterWord, this);

        //  ポーズ機能
        const pauseButton = this.add.sprite(this.scale.width/2 + 625, 875, ImageKeys.PAUSE_SPRITE);
        pauseButton.setInteractive();
        pauseButton.on('pointerover', () => {
            if (this._gameStatus === GameStatus.IsPlaying) {
                this._focusSound.play({volume:0.1, rate: 2});
                pauseButton.setFrame(1);
            }
        }, this);
        pauseButton.on('pointerout', () => {
            if (this._gameStatus === GameStatus.IsPlaying) {
                pauseButton.setFrame(0);
            }
        }, this);
        pauseButton.on('pointerup', () => {
            if (this._gameStatus === GameStatus.IsPlaying) {
                this._inputText.visible = false;
                this.physics.pause();
                this.scene.pause();
                this.scene.launch(SceneKeys.PAUSE);
            }
        }, this);

        this.events.on('resume', () => {
            this._inputText.visible = true;
            this.physics.resume();
        }, this);

        // 該当ステージをノーマルステージにする
        this._saveDataManager.setNormal(this._stageInfo.stage);
    }

    update(_: number, delta: number): void {
        if (this._isLoaded && this._gameStatus === GameStatus.IsNone && this._isUpdateRequire) {
            // １回のみ実行、カウントダウン
            this._countdownTime = 3;
            this._countdownText = this.add.text(
                this.scale.width/2, 450,
                `${this._countdownTime}`,
                {
                    fontFamily: 'Noto Sans JP',
                    fontSize: '100px',
                    color: '#00ff00'
                }
            ).setOrigin(0.5, 0.5);
            this._countdownTimer = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this._countdownTime--;
                    this._countdownText.setText(`${this._countdownTime}`);
                    if (this._countdownTime <= 0) {
                        this._countdownText.destroy();
                        this._countdownTimer.remove();
                        this._gameStatus = GameStatus.IsLoaded;
                        this._isUpdateRequire = true;
                    }
                },
                callbackScope: this,
                loop: true,
            });
            this._isUpdateRequire = false;
        } else if (this._gameStatus === GameStatus.IsLoaded && this._isUpdateRequire) {
            // spawn enemy
            this._spawnTimer = this.time.addEvent({
                delay: this._stageInfo.spawnSpeed,
                loop: true,
                callback: this.spawnEnemy,
                callbackScope: this,
            });
            // change color of enemy
            this._countdownTimer = this.time.addEvent({
                delay: 50,
                callbackScope: this,
                loop: true,
                callback: () => {
                    this._enemyGroup.children.each(child => {
                        const enemy = child as Phaser.GameObjects.Text;
                        let color = enemy.getData('color') as number;
                        if (color < this._characterColors.length-1) {
                            color++;
                            enemy.setColor(this._characterColors[color]);
                            enemy.setData('color', color);
                        }
                        return true;
                    }, this);
                }
            });
            this.spawnEnemy();
            this._gameStatus = GameStatus.IsPlaying;
            this._isUpdateRequire = true;
            this._inputText.visible = true;
        } else if(this._gameStatus === GameStatus.IsPlaying && this._isUpdateRequire) {
            this._enemyGroup.children.each(child => {
                const enemy = child as Phaser.GameObjects.Text;
                const color = enemy.getData('color') as number;
                if (color >= this._characterColors.length-1) {
                    enemy.y += this._speed * delta;
                }

                // attack
                if (enemy.y > 845) {
                    this._bombSound.play({volume: 0.1, rate: 2});
                    const bomb = this.add.sprite(
                        enemy.x, enemy.y, 
                        ImageKeys.EXPLODE2_SPRITE
                    ).play(AnimationKeys.EXPLODE2_ANI);
                    bomb.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        bomb.destroy();
                    }, this);
                    enemy.destroy();
                    this.decreaseAttack();
                    // decrease energy
                    this._energyCurrent--;
                    this.drawEnergyBar(this._energyCurrent, this._energyMax);
                    if (this._energyCurrent === 0) {
                        this._spawnTimer.remove();
                        this._inputText.visible = false;
                        this.destroyAllEnemy(false);
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.physics.pause();
                                this.scene.pause();
                                this._sceneParameter.stage = this._stageInfo.stage;
                                this._sceneParameter.isClear = false;
                                this._sceneParameter.prevScene = SceneKeys.GAME;
                                this.scene.launch(SceneKeys.RESULT, this._sceneParameter);
                            },
                            callbackScope: this,
                            repeat: 0,
                        });
                    }
                }
                return true;
            }, this);
        }

        if (this._inputText.visible) {
            this._inputText.setFocus();
        }
    }

    destroyAllEnemy(isClear: boolean) {
        this._enemyGroup.children.each(child => {
            const enemy = child as Phaser.GameObjects.Text;
            if (isClear) {
                this._fireSound.play({volume: 0.1, rate: 2});
                const fire = this.add.sprite(
                    enemy.x, enemy.y,
                    ImageKeys.EXPLODE1_SPRITE
                ).play(AnimationKeys.EXPLODE1_ANI);
                fire.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    fire.destroy();
                }, this);
            } else {
                this._bombSound.play({volume: 0.1, rate: 2});
                const bomb = this.add.sprite(
                    enemy.x, enemy.y, 
                    ImageKeys.EXPLODE2_SPRITE
                ).play(AnimationKeys.EXPLODE2_ANI);
                bomb.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    bomb.destroy();
                }, this);
            }
            enemy.destroy();
            this.decreaseAttack();
            return true;
        }, this);
    }

    // create enemy
    spawnEnemy () {
        const index = Phaser.Math.Between(0, this._enemyData.length-1);
        const enemy = this.add.text(
            this.scale.width/2, 0, this._enemyData[index],
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '40px',
                color: this._characterColors[0],
            }
        ).setOrigin(0.5, 0.5);
        const x = Phaser.Math.Between(380 + enemy.width/2, 1520 - enemy.width/2);
        const y = enemy.height/2 + 20;
        enemy.x = x;
        enemy.y = y;

        enemy.setDataEnabled();
        enemy.setData('onHidden', false);
        enemy.setData('color', 0);

        this._enemyGroup.add(enemy);
        this.increaseAttack();
    }

    enterWord(inputText: InputText, e:KeyboardEvent) {
        if (e.key === 'Enter' && !e.isComposing) {
            const word = inputText.text;
            inputText.text = '';
            this._enemyGroup.children.each(child => {
                const enemy = child as Phaser.GameObjects.Text;
                if (enemy.text === word) {
                    this._fireSound.play({volume: 0.1, rate: 2});
                    const fire = this.add.sprite(
                        enemy.x, enemy.y,
                        ImageKeys.EXPLODE1_SPRITE
                    ).play(AnimationKeys.EXPLODE1_ANI);
                    fire.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        fire.destroy();
                    }, this);
                    enemy.destroy();
                    this.decreaseAttack();
                    this._scoreCurrent++;
                    this.drawScoreBar(this._scoreCurrent, this._scoreMax);
                    if (this._scoreCurrent === this._scoreMax) {
                        this._spawnTimer.remove();
                        this._inputText.visible = false;
                        this.destroyAllEnemy(true);
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.physics.pause();
                                this.scene.pause();
                                this._sceneParameter.stage = this._stageInfo.stage;
                                this._sceneParameter.isClear = true;
                                this._sceneParameter.prevScene = SceneKeys.GAME;
                                this.scene.launch(SceneKeys.RESULT, this._sceneParameter);
                                // ステージクリアセット
                                this._saveDataManager.setClear(this._stageInfo.stage);
                            },
                            callbackScope: this,
                            repeat: 0,
                        });
                    }
                    return false;
                } else {
                    this._bubuSound.play({volume: 0.1, rate: 2});
                }
                return true;
            }, this);
        }
    }
}