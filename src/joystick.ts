import type * as CSS from 'csstype';
import {
  CreateConfig,
  DirectionType,
  EventType,
  JoystickObj,
} from './interface';
import {
  angle,
  appleStyle,
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
        this.buildDom(this, zoneNode);
        startDom = this.currentJoystick.ui as HTMLElement;
      }

      this.initListener(startDom);
    }
  };

  private buildDom = (instance: Joystick, zone: HTMLElement): void => {
    const { mode, currentJoystick, joystickSize, position, color, backImg } =
      instance;

    if (mode === 'static') {
      zone.style.position = 'relative';
    }

    const ui = document.createElement('div');
    const back = document.createElement('div');
    const front = document.createElement('div');
    currentJoystick.ui = ui;
    currentJoystick.back = back;
    currentJoystick.front = front;

    ui.setAttribute('class', 'joystick_box');
    back.setAttribute('class', 'back');
    front.setAttribute('class', 'front');

    const uiStyle: CSS.Properties<string | number> = {
      position: 'absolute',
      top:
        mode === 'static'
          ? position.top
          : `${currentJoystick.y - joystickSize / 2}px`,
      left:
        mode === 'static'
          ? position.left
          : `${currentJoystick.x - joystickSize / 2}px`,
      right: position.right,
      bottom: position.bottom,
      opacity: mode === 'static' ? '0.5' : '1',
      transition: 'opacity 100ms',
    };
    const backStyle: CSS.Properties = {
      width: `${joystickSize}px`,
      height: `${joystickSize}px`,
      backgroundColor: color.back !== '' ? color.back : 'red',
      borderRadius: '100%',
    };
    const frontStyle: CSS.Properties = {
      width: `${joystickSize / 2}px`,
      height: `${joystickSize / 2}px`,
      backgroundColor: color.front !== '' ? color.front : '#fff',
      borderRadius: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      margin: `${joystickSize / 4}px 0 0 ${joystickSize / 4}px`,
      transform: 'translate(0px, 0px)',
    };

    if (backImg.back !== '') {
      delete backStyle['backgroundColor'];
      backStyle['backgroundImage'] = `url(${backImg.back})`;
      backStyle['backgroundPosition'] = 'center';
      backStyle['backgroundRepeat'] = 'no-repeat';
      backStyle['backgroundSize'] = '100% 100%';
    }
    if (backImg.front !== '') {
      delete frontStyle['backgroundColor'];
      frontStyle['backgroundImage'] = `url(${backImg.front})`;
      frontStyle['backgroundPosition'] = 'center';
      frontStyle['backgroundRepeat'] = 'no-repeat';
      frontStyle['backgroundSize'] = '100% 100%';
    }

    appleStyle(ui, uiStyle);
    appleStyle(back, backStyle);
    appleStyle(front, frontStyle);

    ui.append(back, front);
    zone.appendChild(ui);
    currentJoystick.build = true;
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
        this.buildDom(this, zoneNode);
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
