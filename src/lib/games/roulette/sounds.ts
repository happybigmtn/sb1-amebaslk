import { soundManager } from '../../audio/sounds';

export const ROULETTE_SOUNDS = {
  BALL_SPIN: 'BALL_SPIN',
  BALL_DROP: 'BALL_DROP',
  CHIP_PLACE: 'CHIP_PLACE',
  WIN: 'WIN',
  LOSE: 'LOSE'
} as const;

export const playRouletteSound = (sound: keyof typeof ROULETTE_SOUNDS) => {
  soundManager.play(ROULETTE_SOUNDS[sound]);
};