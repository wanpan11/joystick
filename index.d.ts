interface Position {
  x: number
  y: number
}

interface StyleObj {
  [string]: string
}

interface EventObj {
  start: null | (() => void)
  move: null | (() => void)
  end: null | (() => void)
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
  size: number
}

interface Joystick {
  joystickSize: number
  callBack: EventObj
  currentJoystick: JoystickObj
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