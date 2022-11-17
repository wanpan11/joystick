import { distance, radian, findCoord, buildDom } from './util'

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
  joystickSize = 0
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
    const { zone = '', size = 80 } = config
    const zoneNode = document.getElementById(zone)

    if (zone === '' || zoneNode === null) {
      throw new Error('zoneNode is empty!')
    } else {
      this.joystickSize = size
      this.initListener(zoneNode)
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

      buildDom(this, zoneNode)

      body.addEventListener(toBind.move, this.move, { passive: false })

      if (this.callBack.start != null) {
        this.callBack.start()
      }
    })

    const endArr = toBind.end.split(',')
    endArr.forEach(key => {
      body.addEventListener(key, () => {
        body.removeEventListener(toBind.move, this.move)
        this.destroy()
        if (this.callBack.end != null) {
          this.callBack.end()
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

    /* 限制最大距离 */
    const clampedDist = Math.min(dist, r)
    /* 计算位移点坐标 */
    const clampedPos = findCoord(clampedDist, rad)

    this.currentJoystick.front!.style.transform = `translate(${clampedPos.x}px,${clampedPos.y}px)`

    if (this.callBack.move != null) {
      this.callBack.move()
    }

    e.preventDefault()
  }

  destroy = (): void => {
    if (this.currentJoystick.build) {
      this.currentJoystick.build = false
      this.currentJoystick.front!.style.transform = 'translate(0px, 0px)'
      this.currentJoystick.ui!.style.opacity = '0'

      setTimeout(() => {
        this.currentJoystick.ui!.remove()
      }, 100)
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
