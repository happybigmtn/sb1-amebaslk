import { SpinResult } from './types';

export const ANIMATION_DURATION = 4000; // 4 seconds
export const ROTATIONS = 8; // Number of full rotations

export const calculateRotation = (result: SpinResult): number => {
  const degreePerNumber = 360 / 37;
  const resultPosition = result.number * degreePerNumber;
  return (ROTATIONS * 360) + resultPosition;
};

export const getWheelTransform = (
  spinning: boolean,
  rotation: number,
  progress: number
): string => {
  if (!spinning) return `rotate(${rotation}deg)`;
  
  const easeOut = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const currentRotation = rotation * easeOut(progress);
  return `rotate(${currentRotation}deg)`;
};