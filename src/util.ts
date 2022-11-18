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
export const angle = (radian: number): number => {
  return radian * 180 / Math.PI
}
export const findCoord = (d: number, a: number): Position => {
  const b = { x: 0, y: 0 }
  b.x = -(d * Math.cos(a))
  b.y = -(d * Math.sin(a))
  return b
}
export const getDirection = (ang: number): string => {
  let direction = ''

  if (ang > 45 && ang < 135) {
    direction = 'up'
  } else if (ang > 135 && ang < 225) {
    direction = 'right'
  } else if (ang > 225 && ang < 315) {
    direction = 'down'
  } else {
    direction = 'left'
  }

  return direction
}

/* 构建dom */
export const appleStyle = (node: HTMLElement, style: StyleObj): void => {
  const styleKey = Object.keys(style)
  styleKey.forEach(e => {
    node.style[e as any] = style[e]
  })
}
export const buildDom = (instance: Joystick, zone: HTMLElement): void => {
  const { currentJoystick, joystickSize, color, backImg } = instance

  const ui = document.createElement('div')
  const back = document.createElement('div')
  const front = document.createElement('div')
  currentJoystick.ui = ui
  currentJoystick.back = back
  currentJoystick.front = front

  ui.setAttribute('class', 'joystick_box')
  back.setAttribute('class', 'back')
  front.setAttribute('class', 'front')

  const uiStyle: StyleObj = {
    position: 'fixed',
    top: `${currentJoystick.y - joystickSize / 2}px`,
    left: `${currentJoystick.x - joystickSize / 2}px`,
    opacity: '1',
    transition: 'opacity 100ms'
  }
  const backStyle: StyleObj = {
    width: `${joystickSize}px`,
    height: `${joystickSize}px`,
    'background-color': color.back !== '' ? color.back : 'red',
    'border-radius': '100%'

  }
  const frontStyle: StyleObj = {
    width: `${joystickSize / 2}px`,
    height: `${joystickSize / 2}px`,
    'background-color': color.front !== '' ? color.front : '#fff',
    'border-radius': '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    margin: `${joystickSize / 4}px 0 0 ${joystickSize / 4}px`,
    transform: 'translate(0px, 0px)'
  }

  if (backImg.back !== '') {
    delete backStyle['background-color']
    backStyle['background-image'] = `url(${backImg.back})`
    backStyle['background-position'] = 'center'
    backStyle['background-repeat'] = 'no-repeat'
    backStyle['background-size'] = '100% 100%'
  }
  if (backImg.front !== '') {
    delete frontStyle['background-color']
    frontStyle['background-image'] = `url(${backImg.front})`
    frontStyle['background-position'] = 'center'
    frontStyle['background-repeat'] = 'no-repeat'
    frontStyle['background-size'] = '100% 100%'
  }

  appleStyle(ui, uiStyle)
  appleStyle(back, backStyle)
  appleStyle(front, frontStyle)

  ui.append(back, front)
  zone.appendChild(ui)
  currentJoystick.build = true
}
