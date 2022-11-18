interface Position {
  x: number
  y: number
}

interface StyleObj {
  [key: string]: string
}

interface EventObj {
  start: null | ((Event, Joystick) => void)
  move: null | ((Event, { direction: string, ang: number }) => void)
  end: null | ((Event, Joystick) => void)
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
  zone: string
  size?: number
  color?: { back: string, front: string }
  backImg?: { back: string, front: string }
}

interface Joystick {
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
