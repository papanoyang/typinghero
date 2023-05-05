import AnimationKeys from "../constants/AnimationKeys";
import GameStatus from "../constants/GameStatus";
import ImageKeys from "../constants/ImageKeys";
import JsonKeys from "../constants/JsonKeys";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import EnemeyDatas from "../interfaces/EnemyDatas";
import SceneParams from "../interfaces/SceneParams";
import StageData from "../interfaces/StageData";
import StageDatas from "../interfaces/StageDatas";
import BasicScene from "./Basic";
import InputText from "phaser3-rex-plugins/plugins/inputtext";

export default class GameBasicScene extends BasicScene {
    // stage information
    protected _stageInfo!: StageData;
    // enemy data
    protected _enemyData!: string[];
    // attack counter
    protected _attackCounterText!: Phaser.GameObjects.Text;
    protected _attackCounter!: number;

    // Energy
    protected _energyCountText!: Phaser.GameObjects.Text;
    protected _energyBar!: Phaser.GameObjects.Rectangle;
    protected _energyCurrent = 0;
    protected _energyMax = 0;

    // Score
    protected _scoreCountText!: Phaser.GameObjects.Text;
    protected _scoreBar!: Phaser.GameObjects.Rectangle;
    protected _scoreCurrent = 0;
    protected _scoreMax = 0;

    protected readonly _barWidth = 200;

    // Input
    protected _inputText!: InputText;
    protected _arrowLeft!: Phaser.GameObjects.Sprite;
    protected _arrowRight!: Phaser.GameObjects.Sprite;

    // アップデート制御用
    protected _isUpdateRequire: boolean = true;

    // Status
    protected _gameStatus!: GameStatus;

    // sound
    protected _fireSound!: Phaser.Sound.BaseSound;
    protected _bombSound!: Phaser.Sound.BaseSound;
    protected _bubuSound!: Phaser.Sound.BaseSound;

    constructor(scene: SceneKeys) {
        super(scene);
        this._gameStatus = GameStatus.IsNone;
    }

    preCreate2(data: SceneParams) {
        this.preCreate(data);
        const datas = this.cache.json.get(JsonKeys.STAGE_DATAS) as StageDatas;
        this._stageInfo = datas.stageData.find(child => child.stage === data.stage)!;
        this._fireSound = this.sound.add(SoundKeys.FIRE);
        this._bombSound = this.sound.add(SoundKeys.BOMB);
        this._bubuSound = this.sound.add(SoundKeys.BUBU);
    }

    loadEnemyData() {
        const enemyIndex = this._stageInfo.enemyData;
        const enemyJson = this.cache.json.get(JsonKeys.ENEMY_DATAS) as EnemeyDatas;

        for (let i=0; i<enemyIndex.length; i++) {
            const arr = enemyJson.enemyData.find(child => child.level === enemyIndex[i])!;
            if (i === 0) {
                this._enemyData = arr.data;
            } else {
                this._enemyData = this._enemyData.concat(arr.data);
            }
        }
    }

    drawFirewall() {
        const x1 = 380;
        const y1 = 840;
        const wall = this.add.graphics();
        wall.lineStyle(3, 0x00ff00, 1);
        wall.lineBetween(x1, y1, x1 + 1160, y1);
        wall.lineBetween(x1, y1+20, x1 + 1160, y1+20);
        let x2 = x1;
        let y2 = y1;
        let start = 40;
        const dist = 80;
        for(let i = 0; i < 1200/dist; i++) {
            for (let j = 0; j < 2 ; j++) {
                if (x2 != x1 && x2 < x1+1150) {
                    wall.lineBetween(x2-start*j, y2, x2-start*j, y2 +20);
                }
                y2 += 20;
            }
            x2 += dist;
            y2 = y1;
        }
    }

    drawGamePannel() {
        const x = 710;
        const y = 932;
        const width = 500;
        const height = 80;

        // インプットボックスの背景（枠が見える)
        const inputBackground = this.add.graphics();
        inputBackground.fillStyle(0x00ff00, 1);
        inputBackground.fillRect(
            x-4, y-4, width+8, height+8
        );
        // 偽物インプット
        const box = this.add.graphics();
        box.fillStyle(0x006400, 1);
        box.fillRect(
            x, y, width, height
        );
        // インプットボックス
        const rexInput = new InputText(
            this, x, y, width, height,
            {
                id: 'typinghero-input',
                color: '#99EE90',
                fontSize: '50px',
                fontFamily: 'Noto Sans JP',
                align: 'center',
                backgroundColor: '#006400',
            }
        ).setOrigin(0, 0);
        this._inputText = this.add.existing(rexInput);
        this._inputText.visible = false;
        this._arrowLeft = this.add.sprite(x-60, y + height/2, ImageKeys.ARROW_SPRITE).play(AnimationKeys.ARROW_ANI);
        this._arrowRight = this.add.sprite(x+width+60, y + height/2, ImageKeys.ARROW_SPRITE).play(AnimationKeys.ARROW_ANI);
        this._arrowRight.flipX = true;
    }

    drawAttackCounter() {
        const x = 60;
        const y = 60;
        const width = 240;
        const height = 240;
        const attackCounter = this.add.graphics();
        attackCounter.fillStyle(0x006400, 1);
        attackCounter.fillRoundedRect(x, y, width, height, 5);
        attackCounter.lineStyle(5, 0x00ff00, 1);
        attackCounter.strokeRoundedRect(x, y, width, height, 5);

        const title = this.add.text(x+width/2, y+20, 'ATTACK COUNT',{
            fontFamily: 'Noto Sans JP',
            fontSize: '30px',
            color: '#00ff00'
        }).setOrigin(0.5, 0.5);
        title.setShadow(2, 2, '#000000', 2, true, true);

        this._attackCounter = 0;
        this._attackCounterText = this.add.text(
            x + width/2, y + height/2,
            `${this._attackCounter}`,
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '60px',
                color: '#00ff00',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5, 0.5);
    }

    drawStatusPannel() {
        const x = 1620;
        const y = 60;
        const width = 240;
        const height = 240;

        const pannel = this.add.graphics();
        pannel.fillStyle(0x006400, 1);
        pannel.fillRoundedRect(x, y, width, height, 5);
        pannel.lineStyle(5, 0x00ff00, 1);
        pannel.strokeRoundedRect(x, y, width, height, 5);

        this._energyCountText = this.add.text(x+10, y+10, 'ENERGY: 10/10',{
            fontFamily: 'Noto Sans JP',
            fontSize: '30px',
            color: '#00ff00'
        });
        this._energyCountText.setShadow(2, 2, '#000000', 2, true, true);

        this._scoreCountText = this.add.text(x+10, y+height/2, 'SCORE: 999/999',{
            fontFamily: 'Noto Sans JP',
            fontSize: '30px',
            color: '#00ff00'
        });
        this._scoreCountText.setShadow(2, 2, '#000000', 2, true, true);

        const shadowBar = this.add.graphics();
        shadowBar.fillStyle(0x003300, 1);
        shadowBar.fillRect(
            x + 16, this._energyCountText.y + 46,
            this._barWidth + 8, 38
        );
        this._energyBar = this.add.rectangle(
            x+20, this._energyCountText.y + 50, this._barWidth, 30
        ).setOrigin(0, 0);
        this._energyBar.setFillStyle(0x00ff00, 1);

        // const shadowBar = this.add.graphics();
        shadowBar.fillStyle(0x003300, 1);
        shadowBar.fillRect(
            x + 16, this._scoreCountText.y + 46,
            this._barWidth + 8, 38
        );
        this._scoreBar = this.add.rectangle(
            x+20, this._scoreCountText.y + 50, this._barWidth, 30
        ).setOrigin(0, 0);
        this._scoreBar.setFillStyle(0x00ff00, 1);
    }

    drawEnergyBar(currentValue: number, maxValue: number) {
        const percent = currentValue / maxValue;
        this._energyBar.width = this._barWidth * percent;
        this._energyCountText.setText(`ENERGY: ${currentValue}/${maxValue}`);
    }

    drawScoreBar(currentScore: number, maxScore: number) {
        const percent = currentScore / maxScore;
        this._scoreBar.width = this._barWidth * percent;
        this._scoreCountText.setText(`SCORE: ${currentScore}/${maxScore}`);
    }

    increaseAttack() {
        this._attackCounter++;
        this._attackCounterText.setText(`${this._attackCounter}`);
    }

    decreaseAttack() {
        this._attackCounter--;
        this._attackCounterText.setText(`${this._attackCounter}`);
    }
}