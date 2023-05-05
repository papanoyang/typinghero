import Phaser from "phaser";
import StageScene from "../scenes/Stage";
import ImageKeys from "../constants/ImageKeys";
import SoundKeys from "../constants/SoundKeys";

export default class StageFolder extends Phaser.GameObjects.Container {
    private _box!: Phaser.GameObjects.Rectangle;
    private _cation!: Phaser.GameObjects.Text;
    private _focusSound!: Phaser.Sound.BaseSound;
    private _isEnable!: boolean;

    constructor(
        scene: StageScene, x: number, y: number, isBlue: boolean, stageNo: number,
        onClick: Function, isNew: boolean, isClear: boolean, isLock: boolean
    ) {
        super(scene, x, y);

        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(50, 50).setInteractive();

        const objectArray: Phaser.GameObjects.GameObject[] = [];

        this._focusSound = this.scene.sound.add(SoundKeys.FOCUS);

        this._box = this.scene.add.rectangle(x, y, 50, 50);
        this._box.setStrokeStyle(1, 0x000000);
        this._box.setFillStyle(0x000000, 1);
        objectArray.push(this._box);

        let folderImage: Phaser.GameObjects.Image;
        if (isBlue) {
            folderImage = this.scene.add.image(x, y, ImageKeys.FOLDER_BLUE);
        } else {
            folderImage = this.scene.add.image(x, y, ImageKeys.FOLDER_GREEN);
        }
        objectArray.push(folderImage);

        this._cation = this.scene.add.text(x, y+25, `${stageNo}`,{
            fontFamily: 'Noto Sans JP',
            fontSize: '15px',
            color: '#90ee90'
        }).setOrigin(0.5, 1);
        objectArray.push(this._cation);

        if (isNew) {
            const newText = this.scene.add.text(x, y-5, 'NEW', {
                fontFamily: 'Russo One',
                fontSize: '12px',
                color: '#ffcccb',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0.5);
            objectArray.push(newText);
        }
        if (isClear) {
            const newText = this.scene.add.text(x, y-5, '⭐️', {
                fontFamily: 'Noto Sans JP',
                fontSize: '12px',
            }).setOrigin(0.5, 0.5);
            objectArray.push(newText);
        }
        if (isLock) {
            const newText = this.scene.add.text(x, y-5, '🔒', {
                fontFamily: 'Noto Sans JP',
                fontSize: '12px',
            }).setOrigin(0.5, 0.5);
            objectArray.push(newText);
        }

        this._isEnable = true;

        this.on('pointerover', () => {
            if (!isLock && this._isEnable) {
                this._focusSound.play({rate: 2});
                this._box.setStrokeStyle(1, 0xd3d3d3);
                this._box.setFillStyle(0xa9a9a9, 1);
                this._cation.setColor('#006400');
            }
        }, this);
        this.on('pointerout', () => {
            if (!isLock && this._isEnable) {
                this._box.setStrokeStyle(1, 0x000000);
                this._box.setFillStyle(0x000000, 1);
                this._cation.setColor('#90ee90');
            }
        }, this);
        this.on('pointerup', () => {
            if (!isLock && this._isEnable) {
                onClick();
            }
        }, this);
    }

    setEnable(isEnable: boolean) {
        this._isEnable = isEnable;
    }
}