import AnswerData from "./Answer";

interface DialogueData {
    dialogueNo: number;
    dialogue: string[];
    name: string;
    isInputRequire: boolean;
    answerList: AnswerData[];
    displyaWord: string[];
    helpWord: string[];
    isHelpDisplay: boolean;
    success: number;
    failure: number;
};
export default DialogueData;