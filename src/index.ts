import {
  CreateConfig,
  DirectionType,
  EventType,
  JoystickObj,
} from "./interface";
import {
  distance,
  radian,
  findCoord,
  buildDom,
  angle,
  getDirection,
} from "./util";

const isTouch = !!("ontouchstart" in window);
const events = {
  touch: {
    start: "touchstart",
    move: "touchmove",
    end: "touchend,touchcancel",
  },
  mouse: {
    start: "mousedown",
    move: "mousemove",
    end: "mouseup",
  },
};

let toBind: EventType;
if (isTouch) {
  toBind = events.touch;
} else {
  toBind = events.mouse;
}

type JoystickInstance = Required<CreateConfig>;
interface CallBack {
  start?: (e: Event, Joystick: Joystick) => void;
  move?: (e: Event, info: { direction: DirectionType; ang: number }) => void;
  end?: (e: Event, Joystick: Joystick) => void;
}

class Joystick {
  mode: JoystickInstance["mode"] = "dynamic";
  joystickSize: JoystickInstance["size"] = 0;
  color: JoystickInstance["color"] = { back: "", front: "" };
  backImg: JoystickInstance["backImg"] = { back: "", front: "" };
  position: JoystickInstance["position"] = {
    top: "100px",
    left: "100px",
    right: "",
    bottom: "",
  };
  callBack: CallBack = {
    start: undefined,
    move: undefined,
    end: undefined,
  };

  currentJoystick: JoystickObj = {
    ui: undefined,
    back: undefined,
    front: undefined,
    x: 0,
    y: 0,
    build: false,
  };

  create = (config: CreateConfig): void => {
    const {
      mode = "dynamic",
      zone = "",
      size = 80,
      color,
      backImg,
      position = { top: "100px", left: "100px", right: "", bottom: "" },
    } = config;
    const zoneNode = document.getElementById(zone);

    if (zone === "" || zoneNode === null) {
      throw new Error("zoneNode is empty!");
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
      if (this.mode === "static") {
        buildDom(this, zoneNode);
        startDom = this.currentJoystick.ui as HTMLElement;
      }

      this.initListener(startDom);
    }
  };

  initListener = (zoneNode: HTMLElement): void => {
    const body = document.getElementsByTagName("body")[0];

    /* 监听 */
    zoneNode.addEventListener(toBind.start, (e) => {
      if (e.type === "touchstart") {
        const { clientX, clientY } = (e as TouchEvent).changedTouches[0];
        this.currentJoystick.x = clientX;
        this.currentJoystick.y = clientY;
      } else {
        const { clientX, clientY } = e as MouseEvent;
        this.currentJoystick.x = clientX;
        this.currentJoystick.y = clientY;
      }

      if (this.currentJoystick.build && this.mode === "dynamic") {
        this.currentJoystick.ui!.remove();
      }

      if (this.mode === "dynamic") {
        buildDom(this, zoneNode);
      } else {
        this.currentJoystick.ui!.style.opacity = "1";
      }

      body.addEventListener(toBind.move, this.move, { passive: false });

      if (this.callBack.start != null) {
        this.callBack.start(e, this);
      }
    });

    const endArr = toBind.end.split(",");
    endArr.forEach((key) => {
      body.addEventListener(key, (e) => {
        body.removeEventListener(toBind.move, this.move);
        this.destroy();

        if (this.callBack.end != null) {
          this.callBack.end(e, this);
        }
      });
    });
  };

  move = (e: Event): void => {
    if (!this.currentJoystick.build) return;

    const currentPos = { x: 0, y: 0 };
    if (e.type === "touchmove") {
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

    if (this.callBack.move != null) {
      const ang2 = ang < 0 ? ang + 360 : ang;
      this.callBack.move(e, { direction: getDirection(ang2), ang: ang2 });
    }

    e.preventDefault();
  };

  destroy = (): void => {
    if (this.currentJoystick.build) {
      this.currentJoystick.front!.style.transform = "translate(0px, 0px)";

      if (this.mode === "dynamic") {
        this.currentJoystick.ui!.style.opacity = "0";

        setTimeout(() => {
          this.currentJoystick.build = false;
          this.currentJoystick.ui!.remove();
        }, 100);
      } else {
        this.currentJoystick.ui!.style.opacity = "0.5";
      }
    }
  };

  on = (type: keyof CallBack, cb: () => void): void => {
    const keys = Object.keys(this.callBack);

    if (keys.includes(type)) {
      this.callBack[type] = cb;
    } else {
      throw new Error("event type error!");
    }
  };
}

export default Joystick;
