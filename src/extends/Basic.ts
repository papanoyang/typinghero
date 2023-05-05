import Phaser from "phaser";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import SceneParams from "../interfaces/SceneParams";
import SaveDataManager from "../parts/SaveDataManager";

export default class BasicScene extends Phaser.Scene {
    // 次のシーンへ渡すパラメータ
    protected _sceneParameter!: SceneParams;
    // フェイドインが終わっているか
    protected _isLoaded = false;

    // Sound
    // focus sound
    protected _focusSound!: Phaser.Sound.BaseSound;

    // セーブデータマネジャー
    protected _saveDataManager!: SaveDataManager;

    constructor(scene: SceneKeys) {
        super({key: scene});
        this._sceneParameter = {
            startWidthFadeIn: true,
            stage: -1,
            isClear: false,
            prevScene: SceneKeys.NONE,
        };

        // セーブデータマネジャー
        this._saveDataManager = SaveDataManager.getInstance();
    }

    protected drawButton(x: number, y: number, text:string, size:number, scene: SceneKeys, isFadeIn: boolean) {
        const button = this.add.text(
            x, y,
            text,{
                fontFamily: 'Noto Sans JP',
                fontSize: `${size}px`,
                color: '#00ff00',
        }).setOrigin(0.5, 0.5);
        button.setShadow(2, 2, '#006400', 2, true, true);
        button.setInteractive();
        button.on('pointerover', () => {
            this._focusSound.play({rate: 2})
            button.x -= 2;
            button.y -= 2;
            button.setColor('#99ff90');
            button.setShadow(2, 2, '#00ff00', 2, true, true);
        }, this);
        button.on('pointerout', () => {
            button.x += 2;
            button.y += 2;
            button.setColor('#00ff00');
            button.setShadow(2, 2, '#006400', 2, true, true);
        }, this);
        button.on('pointerup', () => {
            this._sceneParameter.startWidthFadeIn = isFadeIn;
            this.sceneTransition(scene);
            
        }, this);
    }

    sceneTransition(scene: SceneKeys) {
        this._isLoaded = false;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.time.delayedCall(500, () => {
                    this.scene.start(scene, this._sceneParameter);
                });
            }
        );
    }

    drawBackground() {
        // ここで基本的な背景を描画する

        // 基本解像度: 1920x1080
        // ゲーム使用解像度: 1200x900
        // 右: 360, 左: 1560

        const monitorBoxOut = this.add.graphics();
        monitorBoxOut.fillStyle(0x006400, 1);
        monitorBoxOut.fillRoundedRect(360, 0, 1200, 900, 5);
        monitorBoxOut.fillStyle(0x000000, 1);
        monitorBoxOut.fillRoundedRect(380, 20, 1160, 860, 5);

        monitorBoxOut.lineStyle(5, 0x006400, 1);
        monitorBoxOut.lineBetween(360, 905, 0, 1078);
        monitorBoxOut.lineBetween(0, 1077, 1920, 1077);
        monitorBoxOut.lineBetween(1920, 1077, 1560, 905);
        monitorBoxOut.lineBetween(1562, 905, 358, 905);

        // x-top    480, 600, 720, 840, 960, 1080, 1200, 1320, 1440
        // x-bottom 192, 384, 576, 768, 960, 1152, 1344, 1536, 1728
        // y1 945, 990, 1035
        monitorBoxOut.lineBetween(275, 945, 1645, 945);
        monitorBoxOut.lineBetween(180, 990, 1740, 990);
        monitorBoxOut.lineBetween(90, 1035, 1830, 1035);
        monitorBoxOut.lineBetween(480, 905, 192, 1080);
        monitorBoxOut.lineBetween(600, 905, 384, 1080);
        monitorBoxOut.lineBetween(720, 905, 576, 1080);
        monitorBoxOut.lineBetween(840, 905, 768, 1080);
        monitorBoxOut.lineBetween(960, 905, 960, 1080);
        monitorBoxOut.lineBetween(1080, 905, 1152, 1080);
        monitorBoxOut.lineBetween(1200, 905, 1344, 1080);
        monitorBoxOut.lineBetween(1320, 905, 1536, 1080);
        monitorBoxOut.lineBetween(1440, 905, 1728, 1080);

        this.add.text(this.scale.width/2, 890, 'Typing Hero', {
            fontFamily: 'Russo One',
            fontSize: '15px', 
            color: '#000000'
        }).setOrigin(0.5, 0.5);
    }

    preCreate(data: SceneParams) {
        // ここでCreateメソッドの最初に実行するコードをおく

        // focus Sound
        this._focusSound = this.sound.add(SoundKeys.FOCUS);

        // フェイドインするか
        if (data.startWidthFadeIn) {
            this.cameras.main.fadeIn(2000, 0, 0, 0);
        } else {
            // フェイドインなしならすぐ動作できるようにする
            this._isLoaded = true;
        }

        // フェイドインが終わったら動作できるようにする
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
            () => {
                this._isLoaded = true;
            }, this
        );
    }
}