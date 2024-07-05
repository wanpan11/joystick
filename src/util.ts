import type * as CSS from 'csstype';
import { DirectionType } from './interface';

interface Position {
  x: number;
  y: number;
}

export const distance = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x;
  const dy = startPos.y - curPos.y;
  return Math.sqrt(dx * dx + dy * dy);
};
export const radian = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x;
  const dy = startPos.y - curPos.y;

  return Math.atan2(dy, dx);
};
export const angle = (radian: number): number => {
  return (radian * 180) / Math.PI;
};
export const findCoord = (d: number, a: number): Position => {
  const b = { x: 0, y: 0 };
  b.x = -(d * Math.cos(a));
  b.y = -(d * Math.sin(a));
  return b;
};
export const getDirection = (ang: number): DirectionType => {
  let direction: DirectionType = 'left';

  if (ang > 45 && ang < 135) {
    direction = 'up';
  } else if (ang > 135 && ang < 225) {
    direction = 'right';
  } else if (ang > 225 && ang < 315) {
    direction = 'down';
  }

  return direction;
};

/* 构建dom */
export const appleStyle = (
  node: HTMLElement,
  style: CSS.Properties<string | number>,
): void => {
  Object.assign(node.style, style);
};
