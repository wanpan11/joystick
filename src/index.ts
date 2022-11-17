import { distance, radian, findCoord, buildDom } from './util'

class Joystick {
  joystickSize = 0
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
    zoneNode.addEventListener('mousedown', e => {
      const { clientX, clientY } = e
      this.currentJoystick.x = clientX
      this.currentJoystick.y = clientY

      buildDom(this, zoneNode)

      body.addEventListener('mousemove', this.move)
    })

    body.addEventListener('mouseup', () => {
      body.removeEventListener('mousemove', this.move)

      if (this.currentJoystick.build) {
        this.currentJoystick.front!.style.transform = 'translate(0px, 0px)'
        setTimeout(() => {
          this.currentJoystick.ui!.remove()
        }, 100)
      }
    })
  }

  move = (e: MouseEvent): void => {
    if (!this.currentJoystick.build) return

    const currentPos = { x: e.clientX, y: e.clientY }
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
  }
}

export default Joystick
