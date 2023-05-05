import DialogueKeys from "../constants/DialogueKeys";
import StageTypes from "../constants/StageTyps";

interface StageData {
    stage: number;
    stageType: StageTypes;
    clearScore: number;
    energy: number;
    enemySpeed: number;
    spawnSpeed: number;
    rotation: boolean;
    hidden: boolean;
    enemyData: number[];
    dialogue: DialogueKeys;
    clearMessage: string[];
    failureMessage: string[];
};
export default StageData;