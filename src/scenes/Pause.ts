import Phaser from "phaser";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import SceneParams from "../interfaces/SceneParams";

export default class PauseScene extends Phaser.Scene {
    // focus sound
    protected _focusSound!: Phaser.Sound.BaseSound;

    constructor() {
        super({key: SceneKeys.PAUSE});
    }

    create() {
        this._focusSound = this.sound.add(SoundKeys.FOCUS);
        
        const box = this.add.graphics();
        box.fillStyle(0x006400, 1);
        box.fillRoundedRect(
            this.scale.width/2 - 250, 360,
            500, 180, 5
        );
        box.lineStyle(5, 0x00ff00, 1);
        box.strokeRoundedRect(
            this.scale.width/2 - 250, 360,
            500, 180, 5
        );

        const backButton = this.add.text(
            this.scale.width/2, 400,
            'ゲームへもどる',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '30px',
                color: '#00ff00',
            }
        ).setOrigin(0.5, 0.5).setInteractive();
        backButton.on('pointerover', () => {
            this._focusSound.play({rate: 2});
            backButton.x -= 2;
            backButton.y -= 2;
            backButton.setColor('#ffff00');
            backButton.setShadow(2, 2, '#000000', 2, true, true);
        }, this);
        backButton.on('pointerout', () => {
            backButton.x += 2;
            backButton.y += 2;
            backButton.setColor('#00ff00');
            backButton.setShadow(2, 2, '#000000', 2, false, false);
        }, this);
        backButton.on('pointerup', () => {
            this.scene.stop();
            this.scene.resume(SceneKeys.GAME);
        }, this);

        const closeButton = this.add.text(
            this.scale.width/2, 460,
            'ゲームをやめる',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '30px',
                color: '#00ff00',
            }
        ).setOrigin(0.5, 0.5).setInteractive();
        closeButton.on('pointerover', () => {
            this._focusSound.play({rate: 2});
            closeButton.x -= 2;
            closeButton.y -= 2;
            closeButton.setColor('#ffff00');
            closeButton.setShadow(2, 2, '#000000', 2, true, true);
        }, this);
        closeButton.on('pointerout', () => {
            closeButton.x += 2;
            closeButton.y += 2;
            closeButton.setColor('#00ff00');
            closeButton.setShadow(2, 2, '#000000', 2, false, false);
        }, this);
        closeButton.on('pointerup', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {
                    this.time.delayedCall(500, () => {
                        const sceneParams: SceneParams = {
                            startWidthFadeIn: true,
                            stage: -1,
                            isClear: false,
                            prevScene: SceneKeys.NONE,
                        }
                        this.scene.stop(SceneKeys.GAME);
                        this.scene.start(SceneKeys.STAGE, sceneParams);
                    });
                }
            );
        }, this);
    }
}