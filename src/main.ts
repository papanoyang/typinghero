import Phaser from "phaser";
import PreloadScene from "./scenes/Preload";
import TitleScene from "./scenes/Title";
import StageScene from "./scenes/Stage";
import TrainingScene from "./scenes/Training";
import TutorialScene from "./scenes/Tutorial";
import GameScene from "./scenes/Game";
import ResultScene from "./scenes/Result";
import PauseScene from "./scenes/Pause";
import AboutScene from "./scenes/About";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200},
      debug: false,
    },
  },
  scene: [PreloadScene, TitleScene, StageScene, TrainingScene, TutorialScene, GameScene, ResultScene, PauseScene, AboutScene],
};

new Phaser.Game(config);