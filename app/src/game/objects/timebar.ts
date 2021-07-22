import { getGameHeight , getGameWidth } from '../helpers';
import {  HEART   } from 'game/assets';

export class TimeBar extends Phaser.GameObjects.Sprite {
    private bar?:Phaser.GameObjects.Graphics;
    private value= 100;
    private p?: number;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, -200, -200, HEART , 0);
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 1; // percentage

        this.draw();

        scene.add.existing(this.bar);
    }

    public decrease (amount : number)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    public draw ()
    {
        this.bar?.clear();

        //  BG
        this.bar?.fillStyle(0x000000);
        this.bar?.fillRect(this.x, this.y, 80, 16);

        //  Health
        this.bar?.fillStyle(0xffffff);
        this.bar?.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.value < 30)
        {
            this.bar?.fillStyle(0xff0000);
        }
        else
        {
            this.bar?.fillStyle(0x00ff00);
        }

        const d = Math.floor( Math.random() * 100);

        this.bar?.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}
