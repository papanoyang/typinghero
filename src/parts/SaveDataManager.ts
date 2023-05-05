
interface StageInfo {
    stage: number;
    status: number;
}
interface SaveData {
    saveData: StageInfo[];
}

const MAX_STAGE: number = 266;

const DATA_KEY: string = 'th_savedata';

export default class SaveDataManager {
    // インスタンス
    private static _instance: SaveDataManager;

    // セーブデータが存在しなかったら、初期起動とする。
    private _isFirst: boolean = true;

    // セーブデータの構造体
    private _saveData!: SaveData;

    private constructor() {
        // 初期化
        this._saveData = {
            saveData: [],
        };
        this.loadData();
    }

    static getInstance() {
        if (!SaveDataManager._instance) {
            SaveDataManager._instance = new SaveDataManager();
        }
        return SaveDataManager._instance;
    }

    private loadData() {
        const localData = localStorage.getItem(DATA_KEY);
        if (localData) {
            // セーブデータが存在する
            this._saveData = JSON.parse(localData) as SaveData;
            this._isFirst = false;
        } else {
            // セーブデータが存在しない
            this.initData();
            this._isFirst = true;
        }
    }

    private initData() {
        // セーブデータを初期化する
        for(let i=0; i<MAX_STAGE; i++) {
            // ステージステータス
            // 0: Lock
            // 1: New
            // 2: Normal
            // 3: Clear
            let status = -1;
            if (i === 0) {
                // １ステージのみNewにする
                status = 1;
            } else {
                status = 0;
            }
            const stageInfo: StageInfo = {
                stage: i+1,
                status: status,
            }
            this._saveData.saveData.push(stageInfo);
        }
        this.saveData();
    }

    private saveData() {
        localStorage.setItem(DATA_KEY, JSON.stringify(this._saveData));
    }

    isFirst(): boolean {
        return this._isFirst;
    }

    getStatus(stage: number): number {
        const stageInfo = this._saveData.saveData.find(child => child.stage === stage)!;
        return stageInfo.status;
    }

    private _setStatus(stage: number, status: number): void {
        if (status <= this.getStatus(stage)) {
            return;
        }
        let index = stage - 1;
        const stageInfo: StageInfo = {
            stage: stage,
            status: status,
        };
        this._saveData.saveData.splice(index, 1, stageInfo);
        this.saveData();
    }

    setNew(stage: number): void {
        this._setStatus(stage, 1);
    }

    setNormal(stage: number): void {
        this._setStatus(stage, 2);
    }

    setClear(stage: number): void {
        this._setStatus(stage, 3);
        if (stage < MAX_STAGE) {
            this.setNew(stage+1);
        }
    }
}