import AnimationKeys from "../constants/AnimationKeys";
import ImageKeys from "../constants/ImageKeys";
import SceneKeys from "../constants/SceneKeys";
import TrainingBasicScene from "../extends/TrainingBasic";
import InputText from "phaser3-rex-plugins/plugins/inputtext";
import BubbleButton from "../parts/BubbleButton";
import SceneParams from "../interfaces/SceneParams";

enum TrainingStatus {
    None,
    DispMessageBox,
    DispDialogue,
};

export default class TrainingScene extends TrainingBasicScene {
    // Status
    private _trainingStatus = TrainingStatus.None;
    // update controll
    private _isUpdateRequire = true;

    // メッセージ、名前
    private _messageText!: Phaser.GameObjects.Text;
    private _messaageName!: Phaser.GameObjects.Text;
    // 現在のダイアログ番号
    private _currentDNo!: number;

    // 解答のグループ
    private _answerGroup!: Phaser.GameObjects.Group;

    // input
    private _inputText!: InputText;
    private _arrowLeft!: Phaser.GameObjects.Sprite;
    private _arrowRight!: Phaser.GameObjects.Sprite;
    private _dispText!: Phaser.GameObjects.Text;
    private _helpText!: Phaser.GameObjects.Text;

    constructor() {
        super(SceneKeys.TRAINING);
    }

    create(data: SceneParams) {
        this.drawBackground();
        this.preCreate(data);
        this.loadStageData(data.stage);
        this.loadDialogueList();

        this._trainingStatus = TrainingStatus.DispMessageBox;
        this._answerGroup = this.add.group();
        this._dispText = this.add.text(
            this.scale.width/2, 500,
            '',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '100px',
                color: '#00ff00',
            }
        ).setOrigin(0.5, 0.5);
        this._helpText = this.add.text(
            this.scale.width/2, 400,
            '',
            {
                fontFamily: 'Noto Sans JP',
                fontSize: '25px',
                color: '#00ff00',
            }
        ).setOrigin(0.5, 0.5);

        this.drawInput();

        // 該当ステージをノーマルステージにする
        this._saveDataManager.setNormal(this._stageData.stage);
    }

    update(_: number, _2: number): void {
        if (this._isLoaded && this._trainingStatus === TrainingStatus.DispMessageBox) {
            // 最初の１回のみ実施
            const iconX = 500;
            const iconY = 100;
            this.add.image(iconX, iconY, ImageKeys.CHATTH_ICON).setScale(0.5, 0.5).setOrigin(0, 0);
            this._messaageName = this.add.text(iconX + 35, iconY - 2, '???', {fontFamily: 'Noto Sans JP', fontSize: '30px', color: '#00ff00'});
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
            // 次のステータスに遷移
            this._currentDNo = 0;
            this._trainingStatus = TrainingStatus.DispDialogue;
            this._isUpdateRequire = true;
        } else if (this._trainingStatus === TrainingStatus.DispDialogue && this._isUpdateRequire) {
            // ダイアログメッセージ初期化
            this._messageText.setText('');
            this._dispText.setText('');
            this._helpText.setText('');
            this._answerGroup.children.each(child => {
                child.destroy();
                return true;
            });
            if (this._currentDNo < 0) {
                // シナリオの最後であればクリア
                this.physics.pause();
                this.scene.pause();
                this._sceneParameter.stage = this._stageData.stage;
                this._sceneParameter.isClear = true;
                this._sceneParameter.prevScene = SceneKeys.TRAINING;
                this.scene.launch(SceneKeys.RESULT, this._sceneParameter);
                // ステージクリアセット
                this._saveDataManager.setClear(this._stageData.stage);
                return;
            }
            // 名前の表示
            this._messaageName.text = this.getDialogueName(this._currentDNo);
            // ダイアログメッセージのタイピング
            const msg = this.getDialogue(this._currentDNo);
            this.typeDialogue(msg);
            this._isUpdateRequire = false;
        }

        // インプットボックスが活性化されていたら、フォカスする
        if (this._inputText.visible) {
            this._inputText.setFocus();
        }
    }

    drawAnswer() {
        if (this.isInputDialog(this._currentDNo)) {
            // インプットの処理
            this._inputText.visible = true;
            this._arrowLeft.play(AnimationKeys.ARROW_ANI);
            this._arrowRight.play(AnimationKeys.ARROW_ANI);

            const data = this.getDialogueData(this._currentDNo);
            // ランダム表示かどうかは今後検討
            this._dispText.setText(data.displyaWord[0]);
            if (data.isHelpDisplay) {
                this._helpText.setText('ヒント: ' + data.helpWord);
            }
            //
        } else {
            // 解答選択肢
            const answerX = 1200;
            let answerY = 350;
            const answerList = this.getAnswerList(this._currentDNo);

            for (let i=0; i<answerList.length; i++) {
                answerY += 90*i + 20;
                const answerbox = new BubbleButton(
                    this, answerX, answerY, answerList[i].answer.join('\n'),
                    () => {
                        this._currentDNo = answerList[i].nextDialogueNo;
                        this._trainingStatus = TrainingStatus.DispDialogue;
                        this._isUpdateRequire = true;
                    }
                );
                this._answerGroup.add(answerbox);
            }
        }
    }

    drawInput() {
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
                align: 'center',
                backgroundColor: '#006400',
            }
        ).setOrigin(0, 0);
        this._inputText = this.add.existing(rexInput);
        this._inputText.on('keyup', this.enterWord, this);
        this._arrowLeft = this.add.sprite(x-60, y + height/2, ImageKeys.ARROW_SPRITE);
        this._arrowRight = this.add.sprite(x+width+60, y + height/2, ImageKeys.ARROW_SPRITE);
        this._arrowRight.flipX = true;
        this._inputText.visible = false;
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
                    // 選択肢表示もしくはインプット
                    this.drawAnswer();
                }
            },
            repeat: length - 1,
            delay: 100,
        });
    }

    enterWord(inputText: InputText, e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.isComposing) {
            const word = inputText.text;
            inputText.text = '';
            this._inputText.visible = false;
            this._arrowLeft.stop();
            this._arrowLeft.setFrame(0);
            this._arrowRight.stop();
            this._arrowRight.setFrame(0);
            if (word === this._dispText.text) {
                // OK
                this._currentDNo = this.getResultSuccess(this._currentDNo);
            } else {
                // NG
                if (word.toUpperCase() === this._dispText.text) {
                    this._currentDNo = this.getResultSuccess(this._currentDNo);
                } else {
                    this._currentDNo = this.getResultFailure(this._currentDNo);
                }
            }
            this._trainingStatus = TrainingStatus.DispDialogue;
            this._isUpdateRequire = true;
        }
    }
}