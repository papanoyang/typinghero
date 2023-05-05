import Phaser from "phaser";
import SceneKeys from "../constants/SceneKeys";
import JsonKeys from "../constants/JsonKeys";
import StageDatas from "../interfaces/StageDatas";
import ImageKeys from "../constants/ImageKeys";
import SceneParams from "../interfaces/SceneParams";

export default class ResultScene extends Phaser.Scene {
    private _isClear = false;
    private _successMessage!: string;
    private _failureMessage!: string;

    constructor() {
        super({key: SceneKeys.RESULT});
    }

    create(data: SceneParams) {
        this._isClear = data.isClear;
        this.loadMessage(data.stage);

        // layer
        const backLayer = this.add.layer();

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

        this.add.text(
            this.scale.width/2, 420,
            this._isClear ? this._successMessage : this._failureMessage,
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '30px',
                color: '#00ff00',
                align: 'center'
            }
        ).setOrigin(0.5, 0.5);
        // next button
        const nextButton = this.add.text(
            this.scale.width/2 + 140, 500,
            'つぎへ', {
                fontFamily: 'Noto Sans JP',
                fontSize: '30px',
                color: '#00ff00',
            }
        ).setInteractive();
        nextButton.on('pointerover', () => {
            nextButton.setColor('#ffff00');
            nextButton.setShadow(2, 2, '#000000', 2, true, true);
        }, this);
        nextButton.on('pointerout', () => {
            nextButton.setColor('#00ff00');
            nextButton.setShadow(2, 2, '#000000', 2, false, false);
        }, this);
        nextButton.on('pointerup', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {
                    this.time.delayedCall(500, () => {
                        const sceneParams: SceneParams = {
                            startWidthFadeIn: true,
                            stage: data.stage,
                            isClear: true,
                            prevScene: SceneKeys.NONE,
                        }
                        if (data.prevScene != SceneKeys.NONE) {
                            this.scene.stop(data.prevScene);
                        }
                        this.scene.start(SceneKeys.STAGE, sceneParams);
                    });
                }
            );
        }, this);

        if (this._isClear) {
            const emitter = this.add.particles(
                0, 0, ImageKeys.FLARE_SPRITE, {
                    frame: ['yellow', 'green'],
                    lifespan: 1000,
                    speed: {min: 150, max: 250},
                    scale: {start: 0.5, end: 0},
                    gravityY: 150,
                    blendMode: 'ADD',
                    emitting: false,
                }
            );
            backLayer.add(emitter);
    
            this.time.addEvent({
                callback: () => {
                    emitter.x = Phaser.Math.Between(400, 1520);
                    emitter.y = Phaser.Math.Between(100, 700);
                    emitter.explode(30);
                },
                loop: true,
                delay: 1000,
            });
        }
    }

    loadMessage(stage: number) {
        const datas = this.cache.json.get(JsonKeys.STAGE_DATAS) as StageDatas;
        const stageData = datas.stageData.find(child => child.stage === stage)!;
        this._successMessage = stageData.clearMessage.join('\n');
        this._failureMessage = stageData.failureMessage.join('\n');
    }
}