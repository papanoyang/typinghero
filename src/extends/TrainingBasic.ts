import JsonKeys from "../constants/JsonKeys";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import DialogueData from "../interfaces/DialogueData";
import DialogueList from "../interfaces/DialogueList";
import StageData from "../interfaces/StageData";
import StageDatas from "../interfaces/StageDatas";
import BasicScene from "./Basic";

export default class TrainingBasicScene extends BasicScene {
    // ステージ情報
    protected _stageData!: StageData;
    // ダイアログ情報
    protected _dialogueList!: DialogueData[];
    // タイピングサウンド
    protected _typingSound!: Phaser.Sound.BaseSound;

    constructor(scene: SceneKeys) {
        super(scene);
    }

    loadStageData(stage: number) {
        const datas = this.cache.json.get(JsonKeys.STAGE_DATAS) as StageDatas;
        this._stageData = datas.stageData.find(child => child.stage === stage)!;
    }

    loadDialogueList() {
        const datas = this.cache.json.get(this._stageData.dialogue) as DialogueList;
        this._dialogueList = datas.dialogueList;

        // ついでにタイピングサウンド
        this._typingSound = this.sound.add(SoundKeys.TYPING);
    }

    getDialogue(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.dialogue.join('\n');
    }

    getDialogueName(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.name;
    }

    isInputDialog(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.isInputRequire;
    }

    getAnswerList(dialogueNo: number){
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.answerList;
    }

    getDialogueData(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue;
    }

    getResultFailure(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.failure;
    }

    getResultSuccess(dialogueNo: number) {
        const dialogue = this._dialogueList.find(child => child.dialogueNo === dialogueNo)!;
        return dialogue.success;
    }
}