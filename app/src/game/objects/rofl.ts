import { getGameHeight , getGameWidth } from '../helpers';
import { ROFL } from 'game/assets';

export class Rofl extends Phaser.GameObjects.Image {
  private yOrigin = 0;
  private isWaiting = false;

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, ROFL, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 10;
   this.displayWidth = getGameHeight(scene) / 10;

   // physics
   this.scene.physics.world.enable(this);

   this.scene.add.existing(this);
 }

 public activate = (x: number, y: number, position: number, velocityY: number) => {
    // Physics
    //this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    this.getRandomLocation();

    this.yOrigin = this.y;
    //this.setPosition(x, y);
    //this.setFrame(frame);
  }

  public getRandomLocation (){
    const positionIndex = Math.floor(Math.random() * 6) + 1;
    const x = getGameWidth(this.scene)  * ( 3 / 10 );
    const y = getGameHeight(this.scene) * ( 4 / 10 )
    
    switch (true) {
      case positionIndex == 1:
         this.x = getGameWidth(this.scene)  * ( 2 / 10 );
         this.y = getGameHeight(this.scene) * ( 6 / 8 );
        break;
      case positionIndex == 2:
         this.x = getGameWidth(this.scene)  * ( 2 / 10 );
         this.y = getGameHeight(this.scene) * ( 6 / 8 );
        break;
        
      default:  this.x = getGameWidth(this.scene)  * ( 3 / 10 );
       this.y = getGameHeight(this.scene) * ( 4 / 10 );
    }

    this.setPosition(this.x, this.y);

  }

  public update = () => {
      if (this.y < this.yOrigin-100){
        (this.body as Phaser.Physics.Arcade.Body).setVelocityY( getGameHeight(this.scene)/2 );
      }

      
      if (this.y > this.yOrigin && this.isWaiting == false ){
        (this.body as Phaser.Physics.Arcade.Body).setVelocityY( 0 );  
        
        this.isWaiting = true;
      }
      
      
      
  }

  public timeOut = () => {
    this.destroy()
  }

}