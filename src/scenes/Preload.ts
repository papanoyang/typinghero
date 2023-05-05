import Phaser from "phaser";
import SceneKeys from "../constants/SceneKeys";
import SoundKeys from "../constants/SoundKeys";
import JsonKeys from "../constants/JsonKeys";
import ImageKeys from "../constants/ImageKeys";
import AnimationKeys from "../constants/AnimationKeys";
import WebFontLoader from "phaser3-rex-plugins/plugins/webfontloader";
import SceneParams from "../interfaces/SceneParams";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key: SceneKeys.PRELOAD});
    }

    preload() {
        // load web font
        WebFontLoader.call(this.load, {
            google: {
                families: ['DotGothic16', 'Noto Sans JP', 'Russo One']
            }
        });
        // Sound
        this.load.audio(SoundKeys.FOCUS, 'assets/sounds/focus.mp3');
        this.load.audio(SoundKeys.TYPING, 'assets/sounds/typing.mp3');
        this.load.audio(SoundKeys.FIRE, 'assets/sounds/fire.mp3');
        this.load.audio(SoundKeys.BOMB, 'assets/sounds/bomb.mp3');
        this.load.audio(SoundKeys.BUBU, 'assets/sounds/bubu.mp3');

        // JSON
        this.load.json(JsonKeys.STAGE_DATAS, 'data/stagedata.json');
        this.load.json(JsonKeys.ENEMY_DATAS, 'data/enemydata.json');
        // Dialogue Json
        this.load.json(JsonKeys.DIALOGUE01, 'data/dialogue01.json');
        this.load.json(JsonKeys.DIALOGUE02, 'data/dialogue02.json');
        this.load.json(JsonKeys.DIALOGUE03, 'data/dialogue03.json');
        this.load.json(JsonKeys.DIALOGUE04, 'data/dialogue04.json');
        this.load.json(JsonKeys.DIALOGUE05, 'data/dialogue05.json');
        this.load.json(JsonKeys.DIALOGUE06, 'data/dialogue06.json');
        this.load.json(JsonKeys.DIALOGUE07, 'data/dialogue07.json');
        this.load.json(JsonKeys.DIALOGUE08, 'data/dialogue08.json');
        this.load.json(JsonKeys.DIALOGUE09, 'data/dialogue09.json');
        this.load.json(JsonKeys.DIALOGUE10, 'data/dialogue10.json');
        this.load.json(JsonKeys.DIALOGUE11, 'data/dialogue11.json');
        this.load.json(JsonKeys.DIALOGUE12, 'data/dialogue12.json');
        this.load.json(JsonKeys.DIALOGUE13, 'data/dialogue13.json');
        this.load.json(JsonKeys.DIALOGUE14, 'data/dialogue14.json');
        this.load.json(JsonKeys.DIALOGUE15, 'data/dialogue15.json');
        this.load.json(JsonKeys.DIALOGUE16, 'data/dialogue16.json');
        this.load.json(JsonKeys.DIALOGUE17, 'data/dialogue17.json');
        this.load.json(JsonKeys.DIALOGUE18, 'data/dialogue18.json');
        this.load.json(JsonKeys.DIALOGUE19, 'data/dialogue19.json');
        this.load.json(JsonKeys.DIALOGUE20, 'data/dialogue20.json');
        this.load.json(JsonKeys.DIALOGUE21, 'data/dialogue21.json');
        this.load.json(JsonKeys.DIALOGUE22, 'data/dialogue22.json');
        this.load.json(JsonKeys.DIALOGUE23, 'data/dialogue23.json');
        this.load.json(JsonKeys.DIALOGUE24, 'data/dialogue24.json');
        this.load.json(JsonKeys.DIALOGUE25, 'data/dialogue25.json');
        this.load.json(JsonKeys.DIALOGUE26, 'data/dialogue26.json');
        this.load.json(JsonKeys.DIALOGUE27, 'data/dialogue27.json');
        this.load.json(JsonKeys.DIALOGUE28, 'data/dialogue28.json');
        this.load.json(JsonKeys.DIALOGUE29, 'data/dialogue29.json');
        this.load.json(JsonKeys.DIALOGUE30, 'data/dialogue30.json');
        this.load.json(JsonKeys.DIALOGUE31, 'data/dialogue31.json');
        this.load.json(JsonKeys.DIALOGUE32, 'data/dialogue32.json');
        this.load.json(JsonKeys.DIALOGUE33, 'data/dialogue33.json');
        this.load.json(JsonKeys.DIALOGUE34, 'data/dialogue34.json');
        this.load.json(JsonKeys.DIALOGUE35, 'data/dialogue35.json');
        this.load.json(JsonKeys.DIALOGUE36, 'data/dialogue36.json');
        this.load.json(JsonKeys.DIALOGUE37, 'data/dialogue37.json');
        this.load.json(JsonKeys.DIALOGUE38, 'data/dialogue38.json');
        this.load.json(JsonKeys.DIALOGUE39, 'data/dialogue39.json');
        this.load.json(JsonKeys.DIALOGUE40, 'data/dialogue40.json');
        this.load.json(JsonKeys.DIALOGUE41, 'data/dialogue41.json');
        this.load.json(JsonKeys.DIALOGUE42, 'data/dialogue42.json');
        this.load.json(JsonKeys.DIALOGUE43, 'data/dialogue43.json');
        this.load.json(JsonKeys.DIALOGUE44, 'data/dialogue44.json');
        this.load.json(JsonKeys.DIALOGUE45, 'data/dialogue45.json');
        this.load.json(JsonKeys.DIALOGUE46, 'data/dialogue46.json');
        this.load.json(JsonKeys.DIALOGUE47, 'data/dialogue47.json');
        this.load.json(JsonKeys.DIALOGUE48, 'data/dialogue48.json');
        this.load.json(JsonKeys.DIALOGUE49, 'data/dialogue49.json');
        this.load.json(JsonKeys.DIALOGUE50, 'data/dialogue50.json');
        this.load.json(JsonKeys.DIALOGUE51, 'data/dialogue51.json');
        this.load.json(JsonKeys.DIALOGUE52, 'data/dialogue52.json');
        this.load.json(JsonKeys.DIALOGUE53, 'data/dialogue53.json');
        this.load.json(JsonKeys.DIALOGUE54, 'data/dialogue54.json');
        this.load.json(JsonKeys.DIALOGUE55, 'data/dialogue55.json');
        this.load.json(JsonKeys.DIALOGUE56, 'data/dialogue56.json');
        this.load.json(JsonKeys.DIALOGUE57, 'data/dialogue57.json');
        this.load.json(JsonKeys.DIALOGUE58, 'data/dialogue58.json');
        this.load.json(JsonKeys.DIALOGUE59, 'data/dialogue59.json');
        this.load.json(JsonKeys.DIALOGUE60, 'data/dialogue60.json');
        this.load.json(JsonKeys.DIALOGUE61, 'data/dialogue61.json');
        this.load.json(JsonKeys.DIALOGUE62, 'data/dialogue62.json');
        this.load.json(JsonKeys.DIALOGUE63, 'data/dialogue63.json');
        this.load.json(JsonKeys.DIALOGUE64, 'data/dialogue64.json');
        this.load.json(JsonKeys.DIALOGUE65, 'data/dialogue65.json');
        this.load.json(JsonKeys.DIALOGUE66, 'data/dialogue66.json');
        this.load.json(JsonKeys.DIALOGUE67, 'data/dialogue67.json');
        this.load.json(JsonKeys.DIALOGUE68, 'data/dialogue68.json');
        this.load.json(JsonKeys.DIALOGUE69, 'data/dialogue69.json');
        this.load.json(JsonKeys.DIALOGUE70, 'data/dialogue70.json');
        this.load.json(JsonKeys.DIALOGUE71, 'data/dialogue71.json');
        this.load.json(JsonKeys.DIALOGUE72, 'data/dialogue72.json');
        this.load.json(JsonKeys.DIALOGUE73, 'data/dialogue73.json');
        this.load.json(JsonKeys.DIALOGUE74, 'data/dialogue74.json');
        this.load.json(JsonKeys.DIALOGUE75, 'data/dialogue75.json');
        this.load.json(JsonKeys.DIALOGUE76, 'data/dialogue76.json');
        this.load.json(JsonKeys.DIALOGUE77, 'data/dialogue77.json');
        this.load.json(JsonKeys.DIALOGUE78, 'data/dialogue78.json');
        this.load.json(JsonKeys.DIALOGUE79, 'data/dialogue79.json');
        this.load.json(JsonKeys.DIALOGUE80, 'data/dialogue80.json');
        this.load.json(JsonKeys.DIALOGUE81, 'data/dialogue81.json');
        this.load.json(JsonKeys.DIALOGUE82, 'data/dialogue82.json');
        this.load.json(JsonKeys.DIALOGUE83, 'data/dialogue83.json');
        this.load.json(JsonKeys.DIALOGUE84, 'data/dialogue84.json');
        this.load.json(JsonKeys.DIALOGUE85, 'data/dialogue85.json');
        this.load.json(JsonKeys.DIALOGUE86, 'data/dialogue86.json');
        this.load.json(JsonKeys.DIALOGUE87, 'data/dialogue87.json');

        // Images
        this.load.image(ImageKeys.CHATTH_ICON, 'assets/images/chatth_icon.png');
        this.load.image(ImageKeys.FOLDER_BLUE, 'assets/images/folder_blue.png');
        this.load.image(ImageKeys.FOLDER_GREEN, 'assets/images/folder_green.png');

        // Sprite
        this.load.spritesheet(ImageKeys.ARROW_SPRITE, 'assets/sprites/arrow.png', {frameWidth: 100, frameHeight: 60});
        this.load.spritesheet(ImageKeys.POINTER_SPRITE, 'assets/sprites/pointermove.png', {frameWidth: 50, frameHeight: 50});
        this.load.spritesheet(ImageKeys.EXPLODE1_SPRITE, 'assets/sprites/moji_explode.png', {frameWidth: 50, frameHeight: 50});
        this.load.spritesheet(ImageKeys.EXPLODE2_SPRITE, 'assets/sprites/moji_explode2.png', {frameWidth: 50, frameHeight: 50});
        this.load.spritesheet(ImageKeys.PAUSE_SPRITE, 'assets/sprites/pause.png', {frameWidth: 50, frameHeight: 50});

        // Atlas
        this.load.atlas(ImageKeys.FLARE_SPRITE, 'assets/sprites/flares.png', 'assets/sprites/flares.json');
    }

    create() {
        // Animation
        this.anims.create({
            key: AnimationKeys.ARROW_ANI,
            frames: ImageKeys.ARROW_SPRITE,
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: AnimationKeys.POINTER_ANI,
            frames: ImageKeys.POINTER_SPRITE,
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: AnimationKeys.EXPLODE1_ANI,
            frames: ImageKeys.EXPLODE1_SPRITE,
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: AnimationKeys.EXPLODE2_ANI,
            frames: ImageKeys.EXPLODE2_SPRITE,
            frameRate: 25,
            repeat: 0,
        });
        // タイトルシーンへ遷移
        const params: SceneParams ={
            startWidthFadeIn: true,
            stage: -1,
            isClear: false,
            prevScene: SceneKeys.NONE,
        };
        this.scene.start(SceneKeys.TITLE, params);
    }
}