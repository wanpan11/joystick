export type DynamicMode = "dynamic" | "static";

export type DirectionType = "up" | "right" | "down" | "left";

export interface JoystickObj {
  ui?: HTMLElement;
  back?: HTMLElement;
  front?: HTMLElement;
  x: number;
  y: number;
  build: boolean;
}

export interface CreateConfig {
  mode: DynamicMode;
  zone: string;
  size?: number;
  color?: { back: string; front: string };
  backImg?: { back: string; front: string };
  position: {
    top: string | number;
    left: string | number;
    right: string | number;
    bottom: string | number;
  };
}

export interface EventType {
  start: string;
  move: string;
  end: string;
}