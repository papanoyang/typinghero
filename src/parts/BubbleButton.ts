import Phaser from "phaser";
import SoundKeys from "../constants/SoundKeys";
import ImageKeys from "../constants/ImageKeys";
import AnimationKeys from "../constants/AnimationKeys";

export default class BubbleButton extends Phaser.GameObjects.Container {
    // ボタン構成
    private _text!: Phaser.GameObjects.Text;
    private _conttainer!: Phaser.GameObjects.Graphics;
    private _focusSound!: Phaser.Sound.BaseSound;
    private _pointer!: Phaser.GameObjects.Sprite;
    // 大きさ
    private readonly WIDTH = 400;
    private readonly HEIGHT = 90;

    constructor(scene: Phaser.Scene, x: number, y: number, caption: string,　onClick: Function) {
        super(scene, x, y);
        // 親のシーンにこのコンテナを追加
        this.scene = scene;
        this.scene.add.existing(this);
        this._focusSound = scene.sound.add(SoundKeys.FOCUS);
        // サイズ設定してイベント受け入れ可能にする。
        this.setSize(this.WIDTH, this.HEIGHT).setInteractive();

        const boxX = -this.WIDTH/2;
        const boxY = -this.HEIGHT/2;
        
        // テキストを作成
        this._text = scene.add.text(
            boxX + 5, boxY + 5,
            caption, {
                fontFamily: 'Noto Sans JP',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#00ff00',
            }
        ).setOrigin(0, 0);

        this._conttainer = scene.add.graphics();
        this._conttainer.fillStyle(0x006400, 1);
        this._conttainer.fillRoundedRect(boxX, boxY, this.WIDTH, this.HEIGHT, 5);
        this._conttainer.lineStyle(5, 0x00ff00, 1);
        this._conttainer.strokeRoundedRect(boxX, boxY, this.WIDTH, this.HEIGHT, 5);
        const p1x = boxX + this.WIDTH - 30;
        const p1y = boxY + this.HEIGHT - 3;
        const p2x = p1x + 30;
        const p2y = p1y + 15;
        const p3x = p1x + 20;
        this._conttainer.fillTriangle(p1x, p1y, p2x, p2y, p3x, p1y);
        this._conttainer.lineBetween(p1x-1, p1y+3, p2x, p2y);
        this._conttainer.lineBetween(p2x, p2y, p3x+1, p1y+1);

        this._pointer = scene.add.sprite(
            this.WIDTH/2 - 20, this.HEIGHT/2 - 20, 
        ImageKeys.POINTER_SPRITE).setScale(0.5, 0.5).play(AnimationKeys.POINTER_ANI);

        this.add([this._conttainer, this._text, this._pointer]);
        this.on('pointerover', () => {
            this._focusSound.play({rate: 2})
            this._text.setColor('#ffff00');
            this._text.setShadow(2, 2, '#000000', 2, true, true);
        }, this);
        this.on('pointerout', () => {
            this._text.setColor('#00ff00');
            this._text.setShadow(2, 2, '#000000', 2, false, false);
        }, this);

        this.on('pointerup', () => {
            onClick();
        }, this);
    }

    getHeight() {
        return this.HEIGHT;
    }
}