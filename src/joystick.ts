import {
  CreateConfig,
  DirectionType,
  EventType,
  JoystickObj,
} from './interface';
import {
  angle,
  buildDom,
  distance,
  findCoord,
  getDirection,
  radian,
} from './util';

const isTouch = !!('ontouchstart' in window);
const events = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend,touchcancel',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
  },
};

let toBind: EventType;
if (isTouch) {
  toBind = events.touch;
} else {
  toBind = events.mouse;
}

type JoystickInstance = Required<CreateConfig>;
type CallBackType = 'start' | 'move' | 'end';
type CallBack = (
  e: Event,
  info?: { direction: DirectionType; ang: number },
) => void;

class Joystick {
  private mode: JoystickInstance['mode'] = 'dynamic';
  private joystickSize: JoystickInstance['size'] = 0;
  private color: JoystickInstance['color'] = { back: '', front: '' };
  private backImg: JoystickInstance['backImg'] = { back: '', front: '' };
  private position: JoystickInstance['position'] = {
    top: '100px',
    left: '100px',
    right: '',
    bottom: '',
  };

  private callBack: { [k in CallBackType]: CallBack | undefined } = {
    start: undefined,
    move: undefined,
    end: undefined,
  };

  private currentJoystick: JoystickObj = {
    ui: undefined,
    back: undefined,
    front: undefined,
    x: 0,
    y: 0,
    build: false,
  };

  public create = (config: CreateConfig): void => {
    const {
      mode = 'dynamic',
      zone = '',
      size = 80,
      color,
      backImg,
      position = { top: '100px', left: '100px', right: '', bottom: '' },
    } = config;
    const zoneNode = document.getElementById(zone);

    if (!zoneNode) {
      throw new Error('zoneNode is empty!');
    } else {
      this.mode = mode;
      this.joystickSize = size;
      this.position = position;

      if (color) {
        this.color = color;
      }
      if (backImg) {
        this.backImg = backImg;
      }

      let startDom = zoneNode;
      if (this.mode === 'static') {
        buildDom(this, zoneNode);
        startDom = this.currentJoystick.ui as HTMLElement;
      }

      this.initListener(startDom);
    }
  };

  private initListener = (zoneNode: HTMLElement): void => {
    const body = document.getElementsByTagName('body')[0];

    /* 监听 */
    zoneNode.addEventListener(toBind.start, (e) => {
      e.preventDefault?.();

      if (e.type === 'touchstart') {
        const { clientX, clientY } = (e as TouchEvent).changedTouches[0];
        this.currentJoystick.x = clientX;
        this.currentJoystick.y = clientY;
      } else {
        const { clientX, clientY } = e as MouseEvent;
        this.currentJoystick.x = clientX;
        this.currentJoystick.y = clientY;
      }

      if (this.currentJoystick.build && this.mode === 'dynamic') {
        this.currentJoystick.ui!.remove();
      }

      if (this.mode === 'dynamic') {
        buildDom(this, zoneNode);
      } else {
        this.currentJoystick.ui!.style.opacity = '1';
      }

      body.addEventListener(toBind.move, this.move);

      this.callBack.start?.(e);
    });

    const endArr = toBind.end.split(',');
    endArr.forEach((key) => {
      body.addEventListener(key, (e) => {
        body.removeEventListener(toBind.move, this.move);
        this.destroy();

        this.callBack.end?.(e);
      });
    });
  };

  private move = (e: Event): void => {
    if (!this.currentJoystick.build) return;

    const currentPos = { x: 0, y: 0 };
    if (e.type === 'touchmove') {
      const { clientX, clientY } = (e as TouchEvent).changedTouches[0];
      currentPos.x = clientX;
      currentPos.y = clientY;
    } else {
      const { clientX, clientY } = e as MouseEvent;
      currentPos.x = clientX;
      currentPos.y = clientY;
    }

    const r = this.currentJoystick.back!.getBoundingClientRect().width / 2;

    /* 获取斜边长度 */
    const dist = distance(currentPos, this.currentJoystick);
    /* 获取原点夹角 弧度 */
    const rad = radian(currentPos, this.currentJoystick);
    /* 获取原点夹角 角度 */
    const ang = angle(rad);

    /* 限制最大距离 */
    const clampedDist = Math.min(dist, r);
    /* 计算位移点坐标 */
    const clampedPos = findCoord(clampedDist, rad);

    this.currentJoystick.front!.style.transform = `translate(${clampedPos.x}px,${clampedPos.y}px)`;

    if (this.callBack.move) {
      const ang2 = ang < 0 ? ang + 360 : ang;
      this.callBack.move(e, { direction: getDirection(ang2), ang: ang2 });
    }

    e.preventDefault();
  };

  private destroy = (): void => {
    if (this.currentJoystick.build) {
      this.currentJoystick.front!.style.transform = 'translate(0px, 0px)';

      if (this.mode === 'dynamic') {
        this.currentJoystick.ui!.style.opacity = '0';

        setTimeout(() => {
          this.currentJoystick.build = false;
          this.currentJoystick.ui!.remove();
        }, 100);
      } else {
        this.currentJoystick.ui!.style.opacity = '0.5';
      }
    }
  };

  public on = (type: CallBackType, cb: CallBack): void => {
    const keys = Object.keys(this.callBack);

    if (keys.includes(type)) {
      this.callBack[type] = cb;
    } else {
      throw new Error('event type error!');
    }
  };
}

export default Joystick;
