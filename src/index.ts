import {
  distance,
  radian,
  findCoord,
  buildDom,
  angle,
  getDirection
} from './util'

/* 区分事件 */
const isTouch = !!('ontouchstart' in window)
const events = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend,touchcancel'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  }
}
let toBind: EventType
if (isTouch) {
  toBind = events.touch
} else {
  toBind = events.mouse
}

class Joystick {
  mode = 'dynamic'
  position = { top: '100px', left: '100px', right: '', bottom: '' }
  joystickSize = 0
  color = { back: '', front: '' }
  backImg = { back: '', front: '' }
  callBack: EventObj = {
    start: null,
    move: null,
    end: null
  }

  currentJoystick: JoystickObj = {
    ui: null,
    back: null,
    front: null,
    x: 0,
    y: 0,
    build: false
  }

  create = (config: CreateConfig): void => {
    const { mode = 'dynamic', zone = '', size = 80, position = { top: '100px', left: '100px', right: '', bottom: '' }, color, backImg } = config
    const zoneNode = document.getElementById(zone)

    if (zone === '' || zoneNode === null) {
      throw new Error('zoneNode is empty!')
    } else {
      this.mode = mode
      this.joystickSize = size
      this.position = position

      if (color !== undefined) {
        this.color = color
      }
      if (backImg !== undefined) {
        this.backImg = backImg
      }

      let startDom = zoneNode
      if (this.mode === 'static') {
        buildDom(this, zoneNode)
        startDom = this.currentJoystick.ui as HTMLElement
      }

      this.initListener(startDom)
    }
  }

  initListener = (zoneNode: HTMLElement): void => {
    const body = document.getElementsByTagName('body')[0]

    /* 监听 */
    zoneNode.addEventListener(toBind.start, e => {
      if (e.type === 'touchstart') {
        const { clientX, clientY } = (e as TouchEvent).changedTouches[0]
        this.currentJoystick.x = clientX
        this.currentJoystick.y = clientY
      } else {
        const { clientX, clientY } = e as MouseEvent
        this.currentJoystick.x = clientX
        this.currentJoystick.y = clientY
      }

      if (this.currentJoystick.build && this.mode === 'dynamic') {
        this.currentJoystick.ui!.remove()
      }

      if (this.mode === 'dynamic') {
        buildDom(this, zoneNode)
      } else {
        this.currentJoystick.ui!.style.opacity = '1'
      }

      body.addEventListener(toBind.move, this.move, { passive: false })

      if (this.callBack.start != null) {
        this.callBack.start(e, this)
      }
    })

    const endArr = toBind.end.split(',')
    endArr.forEach(key => {
      body.addEventListener(key, e => {
        body.removeEventListener(toBind.move, this.move)
        this.destroy()

        if (this.callBack.end != null) {
          this.callBack.end(e, this)
        }
      })
    })
  }

  move = (e: Event): void => {
    if (!this.currentJoystick.build) return

    const currentPos = { x: 0, y: 0 }
    if (e.type === 'touchmove') {
      const { clientX, clientY } = (e as TouchEvent).changedTouches[0]
      currentPos.x = clientX
      currentPos.y = clientY
    } else {
      const { clientX, clientY } = e as MouseEvent
      currentPos.x = clientX
      currentPos.y = clientY
    }

    const r = this.currentJoystick.back!.getBoundingClientRect().width / 2

    /* 获取斜边长度 */
    const dist = distance(currentPos, this.currentJoystick)
    /* 获取原点夹角 弧度 */
    const rad = radian(currentPos, this.currentJoystick)
    /* 获取原点夹角 角度 */
    const ang = angle(rad)

    /* 限制最大距离 */
    const clampedDist = Math.min(dist, r)
    /* 计算位移点坐标 */
    const clampedPos = findCoord(clampedDist, rad)

    this.currentJoystick.front!.style.transform = `translate(${clampedPos.x}px,${clampedPos.y}px)`

    if (this.callBack.move != null) {
      const ang2 = ang < 0 ? ang + 360 : ang
      this.callBack.move(e, { direction: getDirection(ang2), ang: ang2 })
    }

    e.preventDefault()
  }

  destroy = (): void => {
    if (this.currentJoystick.build) {
      this.currentJoystick.front!.style.transform = 'translate(0px, 0px)'

      if (this.mode === 'dynamic') {
        this.currentJoystick.ui!.style.opacity = '0'

        setTimeout(() => {
          this.currentJoystick.build = false
          this.currentJoystick.ui!.remove()
        }, 100)
      } else {
        this.currentJoystick.ui!.style.opacity = '0.5'
      }
    }
  }

  on = (type: string, cb: () => void): void => {
    const keys = Object.keys(this.callBack)

    if (keys.indexOf(type) === -1) {
      throw new Error('event type error!')
    } else {
      this.callBack[type as keyof EventObj] = cb
    }
  }
}

export default Joystick
