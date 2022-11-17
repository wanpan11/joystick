interface Position {
  x: number
  y: number
}

interface StyleObj {
  [string]: string
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
  currentJoystick: JoystickObj
  create: (config: CreateConfig) => void
  move: (e: MouseEvent) => void
}
