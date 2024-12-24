// Sound effect URLs from a CDN
export const SOUND_EFFECTS = {
  CARD_DEAL: 'https://cdn.example.com/sounds/card-deal.mp3',
  CARD_FLIP: 'https://cdn.example.com/sounds/card-flip.mp3',
  CHIP_STACK: 'https://cdn.example.com/sounds/chip-stack.mp3',
  WIN: 'https://cdn.example.com/sounds/win.mp3',
  LOSE: 'https://cdn.example.com/sounds/lose.mp3',
  PUSH: 'https://cdn.example.com/sounds/push.mp3'
};

class SoundManager {
  private audio: { [key: string]: HTMLAudioElement } = {};
  private enabled = true;

  constructor() {
    Object.entries(SOUND_EFFECTS).forEach(([key, url]) => {
      this.audio[key] = new Audio(url);
      this.audio[key].preload = 'auto';
    });
  }

  play(sound: keyof typeof SOUND_EFFECTS) {
    if (this.enabled && this.audio[sound]) {
      this.audio[sound].currentTime = 0;
      this.audio[sound].play();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();