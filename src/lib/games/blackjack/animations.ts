export const CARD_ANIMATION_DURATION = 300;
export const FLIP_ANIMATION_DURATION = 500;

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export const calculateCardPosition = (
  index: number,
  total: number,
  isDealer: boolean
): CardPosition => {
  const baseX = 50 - (total * 30) / 2;
  const x = baseX + (index * 30);
  const y = isDealer ? 20 : 60;
  const rotation = (index - Math.floor(total / 2)) * 5;
  const scale = 1;

  return { x, y, rotation, scale };
};

export const getCardTransform = (position: CardPosition): string => {
  return `translate(${position.x}%, ${position.y}%) 
          rotate(${position.rotation}deg) 
          scale(${position.scale})`;