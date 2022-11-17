/* 计算 */
export const distance = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x
  const dy = startPos.y - curPos.y
  return Math.sqrt(dx * dx + dy * dy)
}
export const radian = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x
  const dy = startPos.y - curPos.y

  return Math.atan2(dy, dx)
}
export const findCoord = (d: number, a: number): Position => {
  const b = { x: 0, y: 0 }
  b.x = -(d * Math.cos(a))
  b.y = -(d * Math.sin(a))
  return b
}

/* 构建dom */
export const appleStyle = (node: HTMLElement, style: StyleObj): void => {
  const styleKey = Object.keys(style)
  styleKey.forEach(e => {
    node.style[e as keyof StyleObj] = style[e as keyof StyleObj]
  })
}
export const buildDom = (instance: Joystick, zone: HTMLElement): void => {
  const { currentJoystick, joystickSize } = instance

  const ui = document.createElement('div')
  const back = document.createElement('div')
  const front = document.createElement('div')
  currentJoystick.ui = ui
  currentJoystick.back = back
  currentJoystick.front = front

  ui.setAttribute('className', 'joystick_box')
  back.setAttribute('className', 'back')
  front.setAttribute('className', 'front')

  const uiStyle = {
    position: 'fixed',
    top: `${currentJoystick.y - joystickSize / 2}px`,
    left: `${currentJoystick.x - joystickSize / 2}px`
  }
  const backStyle = {
    width: `${joystickSize}px`,
    height: `${joystickSize}px`,
    'background-color': 'red',
    'border-radius': '100%'
  }
  const frontStyle = {
    width: `${joystickSize / 2}px`,
    height: `${joystickSize / 2}px`,
    'background-color': '#fff',
    'border-radius': '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    margin: `${joystickSize / 4}px 0 0 ${joystickSize / 4}px`,
    transform: 'translate(0px, 0px)'
  }
  appleStyle(ui, uiStyle)
  appleStyle(back, backStyle)
  appleStyle(front, frontStyle)

  ui.append(back, front)
  zone.appendChild(ui)
  currentJoystick.build = true
}
