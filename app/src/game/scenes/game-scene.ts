import {   LEFT_CHEVRON, BG, CLICK , POP , GONE , GAMETUNE } from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player , Rofl } from 'game/objects';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private rofls?: Phaser.GameObjects.Group;

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private pop?: Phaser.Sound.BaseSound;
  private gone?: Phaser.Sound.BaseSound;
  private gametune?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  // Timer Settings
  private addTimer = 3000;
  private deleteTimer = 5000;
  private addDelta = 200;
  private deleteDelta = 100; 
  private currentAddTimer = this.addTimer;
  private currentDeleteTimer = this.deleteTimer;


  // Rofls
  private addRofls = () =>{
     const size = getGameHeight(this) / 7;
     const x = getGameWidth(this)  / 2;
     const y = getGameHeight(this) / 2;
     const velocityY = -getGameHeight(this) *  0.75 ;
     const position = Math.floor(Math.random() * 6) + 1;

     this.addRofl(x, y, position, velocityY );

    
     this.currentAddTimer = this.currentAddTimer - this.addDelta;     

  };

  // Add Rofl
  private addRofl = (x: number, y: number, position: number, velocityY: number) : void =>{
    const rofl: Rofl = this.rofls?.get();
    rofl.activate(x, y, position, velocityY);
    this.pop?.play();
     
    // adding killer timer
     this.time.addEvent({
      delay: this.currentDeleteTimer,
      callback: rofl.timeOut,
      loop: false,
    });
  };

  public roflGone= () => {
    this.addCrazyScore();
  };

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  public create(): void {
    // Add layout
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.pop = this.sound.add(POP, { loop: false });
    this.gone = this.sound.add(GONE, { loop: false });
    this.gametune = this.sound.add(GAMETUNE, { loop: true });
    this.createBackButton();

    // Play main tune
    this.gametune?.play();

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    });

    this.scoreText = this.add
    .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(190, this), this.score.toString(), {
      color: '#FFFFFF',
    })
    .setFontSize(getRelative(94, this))
    .setOrigin(0.5)
    .setDepth(1);


    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: 10,
      classType: Rofl,
      runChildUpdate: true,
     });

     this.addRofls();

     
     // Adding Rofl to the scene
     this.time.addEvent({
        delay: this.currentAddTimer,
        callback: this.addRofls,
        callbackScope: this,
        loop: true,
     });

  }

  public addScore = () => {
    if (this.scoreText) {
      this.score += 1;
      this.scoreText.setText(this.score.toString());
    }
  };

  public addCrazyScore = () => {
    if (this.scoreText) {
      this.score -= 100;
      this.scoreText.setText(this.score.toString());
    }
  };



  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on('pointerdown', () => {
        this.back?.play();
        window.history.back();
      });
  };

  public update(): void {
    // Every frame, we update the player
    this.player?.update();

    if (this.player && !this.player?.getDead()) {
      this.physics.overlap(
        this.player,
        this.rofls,
        (_, rofl) => {
          (rofl as Rofl).squashRofl();
          this.addScore();

          this.currentDeleteTimer = this.currentDeleteTimer - this.deleteDelta;

        }
      )
    }

  }
}
