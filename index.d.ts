interface Position {
  x: number
  y: number
}

interface StyleObj {
  [key: string]: string
}

interface EventObj {
  start: null | ((Event, Joystick) => void)
  move: null | ((Event, { direction, ang }: MoveInfo) => void)
  end: null | ((Event, Joystick) => void)
}

interface MoveInfo {
  direction: string
  ang: number
}

interface JoystickObj {
  ui: null | HTMLElement
  back: null | HTMLElement
  front: null | HTMLElement
  x: number
  y: number
  build: boolean
}

interface CreateConfig {
  mode: string
  zone: string
  size?: number
  position: { top: string, left: string, right: string, bottom: string }
  color?: { back: string, front: string }
  backImg?: { back: string, front: string }
}

interface Joystick {
  mode: string
  position: { top: string, left: string, right: string, bottom: string }
  joystickSize: number
  callBack: EventObj
  currentJoystick: JoystickObj
  color: { back: string, front: string }
  backImg: { back: string, front: string }
  create: (config: CreateConfig) => void
  initListener: (zoneNode: HTMLElement) => void
  move: (e: Event) => void
  destroy: () => void
  on: (type: string, cb: () => void) => void
}

interface EventType {
  start: string
  move: string
  end: string
};
