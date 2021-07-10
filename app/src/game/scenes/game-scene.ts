import {   LEFT_CHEVRON, BG, CLICK , POP , GONE , SQUASH, GAMETUNE, GAMEOVER } from 'game/assets';
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
  private squash?: Phaser.Sound.BaseSound;
  private gametune?: Phaser.Sound.BaseSound;
  private gameover?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  private lives?: number;
  private roflCount = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private livesText?: Phaser.GameObjects.Text;

  // Active scoring elements
  private countActive = 0;

  // Timer Settings
  private popTimerIni = 3000;
  private goneTimerIni = 5000;
  private popTimer?: number;//= this.popTimerIni;
  private goneTimer?: number;// = this.goneTimerIni;
  private gameOverTimer = 3000;

  // Local states and aux  variables
  private endingGame =  false;

  // Rofls
  private addRofls = () =>{
     const size = getGameHeight(this) / 7;
     const x = getGameWidth(this)  / 2;
     const y = getGameHeight(this) / 2;
     const velocityY = -getGameHeight(this) *  0.75 ;
     const position = Math.floor(Math.random() * 6) + 1;
    
     if (this.endingGame == false){
      this.roflCount += 1;

      this.addRofl(x, y, position, velocityY );

      this.updateTimers(); 
    //this.updateGoneTimer();
    }

  };

  // Add Rofl
  private addRofl = (x: number, y: number, position: number, velocityY: number) : void =>{
    const rofl: Rofl = this.rofls?.get();

    rofl.activate(x, y, position, velocityY);

    this.pop?.play();
     
    // adding TimeOut and Next timer
    this.time.addEvent({
      delay: this.goneTimer,
      callback: this.roflTimeOut, 
      args: [rofl as Rofl],
      loop: false,
    });

    this.time.addEvent({
      delay: this.popTimer,
      callback: this.addRofls,
      callbackScope: this,
      loop: false,
    });

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
    this.squash = this.sound.add(SQUASH, { loop: false });
    this.gametune = this.sound.add(GAMETUNE, { loop: true });
    this.gameover = this.sound.add(GAMEOVER, { loop: false });
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

    // Initializing lives counter
    this.lives = this.player.getLives();

    // Score & Lives boards
    this.scoreText = this.add
    .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(190, this), this.score.toString(), { color: '#FFFFFF',   })
    .setFontSize(getRelative(94, this))
    .setOrigin(0.5)
    .setDepth(1);

    this.livesText = this.add
    .text(getGameWidth(this) * 0.1, getGameHeight(this) * 0.1,'Lives: '+ this.lives.toString(), { color: '#FFFFFF',  })
    .setFontSize(getRelative(70, this))
    .setOrigin(0.5)
    .setDepth(1);



    // Add Rofl group for pooling
    this.rofls = this.add.group({
      maxSize: 10,
      classType: Rofl,
      runChildUpdate: true,
     });
     
     this.addRofls();

  }

  // score-related functions
  private addScore = () => {
    if (this.scoreText) {
      this.score += 1;
      this.scoreText.setText(this.score.toString());
    }
  };

  // methods related to rolf interactions
  private squashRofl = (rofl : Rofl) => {
    this.squash?.play();
    rofl.setDead(true);
    this.addScore();
  };

  private roflTimeOut = (rofl : Rofl) => {

    if (!rofl.isDead && this.player != undefined && this.endingGame == false ){
      
      this.player.removeLife();
      
      this.updateLivesCounter();

      this.gone?.play();
      rofl.setDead(true);
    }

  };

  // Updating live counter
  private updateLivesCounter= () => {
    if ( this.player != undefined && this.livesText != undefined){ //
      this.lives = this.player.getLives();
      this.livesText.setText( 'Lives: ' + this.lives.toString() );
   }
  };


  // timer settings
  // reference (negative exponential model): y = t0* ( exp(-a*x+log(1-b)) +b ) = t0*(exp(alpha)+b)
  private updateTimers (){
    const b = 0.1;
    const a = 0.05;
    const alpha = (-a*this.roflCount)+Math.log2(0.95);

    if ( this.popTimer != undefined && this.goneTimer != undefined ){
      
      this.popTimer = Math.floor(this.popTimerIni*(Math.exp(alpha)+b));
      this.goneTimer = Math.floor(this.goneTimerIni*(Math.exp(alpha)+b));

      /*
      if (this.scoreText) {
        this.score = this.popTimer;
        this.scoreText.setText(this.score.toString());
      }*/
    } else {

      this.popTimer = this.popTimerIni;
      this.goneTimer = this.goneTimerIni;

    }

  }



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

  private endGame(){
    window.history.back();
  }

  public update(): void {
    // Every frame, we update the player
    this.player?.update();

    if (this.player && !this.player?.getDead()) {
      this.physics.overlap(
        this.player,
        this.rofls,
        (_, rofl) => {
          this.squashRofl(rofl as Rofl); //(rofl as Rofl).squashRofl();
        }
      )
    } else {
      if ( this.endingGame == false ){
        // Play gameover sound
        this.gametune?.stop();
        this.gameover?.play();
        this.endingGame = true;
        
        

        this.time.addEvent({
         delay: this.gameOverTimer,
         callback: this.endGame,
          callbackScope: this,
          loop: false,
        });
      
      }
      
    }



  }
}
