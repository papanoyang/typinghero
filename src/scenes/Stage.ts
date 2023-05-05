import JsonKeys from "../constants/JsonKeys";
import SceneKeys from "../constants/SceneKeys";
import StageTypes from "../constants/StageTyps";
import BasicScene from "../extends/Basic";
import SceneParams from "../interfaces/SceneParams";
import StageDatas from "../interfaces/StageDatas";
import StageFolder from "../parts/StageFolder";

export default class StageScene extends BasicScene {
    // ステージデータ
    private _stageDatas!: StageDatas;

    // button group
    private _buttonGroup!: Phaser.GameObjects.Group;

    constructor() {
        super(SceneKeys.STAGE);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate(data);

        this._stageDatas = this.loadDialogeList();

        this._buttonGroup = this.add.group();
        this.drawStageButton();
    }

    protected drawStageButton(){
        let stageX = 360;
        let stageY = 60;
        const btnWidth = 50
        for (let i=0; i<this._stageDatas.stageData.length; i++) {
            stageX += btnWidth + 10;
            const stageData = this._stageDatas.stageData[i];
            let folderType: boolean;
            if (stageData.stageType === StageTypes.GAME) {
                folderType = true;
            } else {
                folderType = false;
            }

            // ステージのステータスを取得する
            let isNew = false;
            let isClear = false;
            let isLock = false;
            if (this._saveDataManager.getStatus(stageData.stage) === 0) {
                // is lock
                isNew = false;
                isClear = false;
                isLock = true;
            } else if (this._saveDataManager.getStatus(stageData.stage) === 1) {
                // is new
                isNew = true;
                isClear = false;
                isLock = false;
            } else if (this._saveDataManager.getStatus(stageData.stage) === 2) {
                // is normal
                isNew = false;
                isClear = false;
                isLock = false;
            } else {
                // is clear
                isNew = false;
                isClear = true;
                isLock = false;
            }
            const button = new StageFolder(
                this, stageX, stageY, folderType, stageData.stage, () => {
                    if (!this._isLoaded) {
                        return;
                    }
                    this._buttonGroup.children.each(child => {
                        const btn = child as StageFolder;
                        btn.setEnable(false);
                        return true;
                    }, this);
                    this._sceneParameter.stage = stageData.stage;
                    if (stageData.stageType === StageTypes.TRAINING) {
                        this.sceneTransition(SceneKeys.TRAINING);
                    } else if (stageData.stageType === StageTypes.TUTORIAL) {
                        this.sceneTransition(SceneKeys.TUTORIAL);
                    } else {
                        this.sceneTransition(SceneKeys.GAME);
                    }
                }, isNew, isClear, isLock
            );
            this._buttonGroup.add(button);
            if ((i + 1) % 19 === 0) {
                stageX = 360;
                stageY += 60;
            }
        }
    }
    private loadDialogeList() {
        const data = this.cache.json.get(JsonKeys.STAGE_DATAS) as StageDatas;
        return data;
    }
}