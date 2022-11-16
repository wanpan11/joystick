const zone = document.getElementById('joystick_box') as HTMLElement
const body = document.getElementsByTagName('body')[0]

const joystickSize = 100
/* 当前存在的摇杆节点 */
const currentJoystick: JoystickObj = {
  ui: null,
  back: null,
  front: null,
  x: 0,
  y: 0,
  build: false
}

/* 计算 */
const distance = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x
  const dy = startPos.y - curPos.y
  return Math.sqrt(dx * dx + dy * dy)
}
const radian = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x
  const dy = startPos.y - curPos.y

  return Math.atan2(dy, dx)
}
const findCoord = (d: number, a: number): Position => {
  const b = { x: 0, y: 0 }
  b.x = -(d * Math.cos(a))
  b.y = -(d * Math.sin(a))
  return b
}

/* 构建dom */
const appleStyle = (node: HTMLElement, style: StyleObj): void => {
  const styleKey = Object.keys(style)
  styleKey.forEach(e => {
    node.style[e as keyof StyleObj] = style[e as keyof StyleObj]
  })
}
const buildDom = (zone: HTMLElement): void => {
  const ui = document.createElement('div')
  const back = document.createElement('div')
  const front = document.createElement('div')
  currentJoystick.ui = ui
  currentJoystick.back = back
  currentJoystick.front = front

  ui.setAttribute('id', 'joystick')
  back.setAttribute('id', 'back')
  front.setAttribute('id', 'front')

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

/* 移动 */
const move = (e: MouseEvent): void => {
  if (!currentJoystick.build) return

  const currentPos = { x: e.clientX, y: e.clientY }
  const r = currentJoystick.back!.getBoundingClientRect().width / 2

  /* 获取斜边长度 */
  const dist = distance(currentPos, currentJoystick)
  /* 获取原点夹角 弧度 */
  const rad = radian(currentPos, currentJoystick)

  /* 限制最大距离 */
  const clampedDist = Math.min(dist, r)
  /* 计算位移点坐标 */
  const clampedPos = findCoord(clampedDist, rad)

  currentJoystick.front!.style.transform = `translate(${clampedPos.x}px,${clampedPos.y}px)`
}

/* 监听 */
zone.addEventListener('mousedown', e => {
  const { clientX, clientY } = e
  currentJoystick.x = clientX
  currentJoystick.y = clientY

  buildDom(zone)

  body.addEventListener('mousemove', move)
})

body.addEventListener('mouseup', e => {
  body.removeEventListener('mousemove', move)

  if (currentJoystick.build) {
    currentJoystick.front!.style.transform = 'translate(0px, 0px)'
    setTimeout(() => {
      currentJoystick.ui!.remove()
    }, 100)
  }
})
