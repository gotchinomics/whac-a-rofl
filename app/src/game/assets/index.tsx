export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO';
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}

export const BG = 'bg';
export const BGLOL = 'bglol';
export const NET = 'net';
export const DRANK = 'drank';
export const GRENADE = 'grenade';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const CLICK = 'click';
export const POP = 'pop';
export const EXPLOSION = 'explosion';
export const OPENCAN = 'opencan';
export const GONE = 'gone';
export const SQUASH = 'squash';
export const LICKING = 'licking';
export const GODLIKESQUASH = 'godlikesquash';
export const GAMETUNE = 'gametune';
export const EPICTUNE = 'epictune';
export const GAMEOVER = 'gameover';
export const HEART = 'heart';
export const COMMONROFL = 'commonrofl';
export const GRENADEROFL = 'grenaderofl';
export const DRANKROFL = 'drankrofl';
export const HEARTROFL = 'heartrofl';
export const COMMONROFLDRANK = 'commonrofldrank';
export const GRENADEROFLDRANK = 'grenaderofldrank';
export const DRANKROFLDRANK = 'drankrofldrank';
export const HEARTROFLDRANK = 'heartrofldrank';
export const LICKQUIDATOR = 'lickquidator';
export const SPLASH = 'splash';
export const HITTING = 'hitting';
export const SPARK = 'spark';
export const SPARK2 = 'spark2';


// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/images/bg3.png',
    type: 'IMAGE',
  },
  {
    key: BGLOL,
    src: 'assets/images/bg_lol2.png',
    type: 'IMAGE',
  },
  {
    key: NET,
    src: 'assets/icons/cursor_net.cur',
    type: 'IMAGE',
  },
  {
    key: DRANK,
    src: 'assets/icons/lilpumpdrank.svg',
    type: 'SVG',
  },
  {
    key: GRENADE,
    src: 'assets/icons/grenade.svg',
    type: 'SVG',
  },
  {
    key: LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: POP,
    src: 'assets/sounds/pop.mp3',
    type: 'AUDIO',
  },
  {
    key: EXPLOSION,
    src: 'assets/sounds/explosion3.mp3',
    type: 'AUDIO',
  },
  {
    key: OPENCAN,
    src: 'assets/sounds/opencan.mp3',
    type: 'AUDIO',
  },
  {
    key: GONE,
    src: 'assets/sounds/gone.mp3',
    type: 'AUDIO',
  },
  {
    key: SQUASH,
    src: 'assets/sounds/squash.mp3',
    type: 'AUDIO',
  },
  {
    key: LICKING,
    src: 'assets/sounds/licking.mp3',
    type: 'AUDIO',
  },
  {
    key: GAMETUNE,
    src: 'assets/sounds/gametune.mp3',
    type: 'AUDIO',
  },
  {
    key: EPICTUNE,
    src: 'assets/sounds/epictuneshort.mp3',
    type: 'AUDIO',
  },
  {
    key: GAMEOVER,
    src: 'assets/sounds/gameover.mp3',
    type: 'AUDIO',
  },
  {
    key: HEART,
    src: 'assets/sprites/heart.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 64 / 1,
      frameHeight: 64 / 1,
    }
  },
  {
    key: COMMONROFL,
    src: 'assets/sprites/commonrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: GRENADEROFL,
    src: 'assets/sprites/grenaderofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: DRANKROFL,
    src: 'assets/sprites/drankrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: HEARTROFL,
    src: 'assets/sprites/heartrofl.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: COMMONROFLDRANK,
    src: 'assets/sprites/commonrofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: GRENADEROFLDRANK,
    src: 'assets/sprites/grenaderofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: DRANKROFLDRANK,
    src: 'assets/sprites/drankrofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: HEARTROFLDRANK,
    src: 'assets/sprites/heartrofl_drank.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 512 / 1,
      frameHeight: 512 / 1,
    }
  },
  {
    key: LICKQUIDATOR,
    src: 'assets/sprites/liquidator_spritev2.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 2048 / 4,
    }
  },
  {
    key: SPLASH,
    src: 'assets/sprites/splash_spritev3.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 1024 / 2,
    }
  },
  {
    key: HITTING,
    src: 'assets/sprites/hitting_sprite_px.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 2048 / 4,
    }
  },
  {
    key: SPARK,
    src: 'assets/sprites/spark.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 1536 / 3,
    }
  },
  {
    key: SPARK2,
    src: 'assets/sprites/gotchispark.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 2048 / 4,
      frameHeight: 1536 / 3,
    }
  },
];


/*
{
    key: LICKQUIDATOR,
    src: 'assets/sprites/lickquidator.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 553 / 1,
      frameHeight: 553 / 1,
    }
  },
*/