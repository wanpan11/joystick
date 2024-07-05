import type * as CSS from "csstype";
import { DirectionType } from "./interface";
import Joystick from ".";

interface Position {
  x: number;
  y: number;
}

export const distance = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x;
  const dy = startPos.y - curPos.y;
  return Math.sqrt(dx * dx + dy * dy);
};
export const radian = (curPos: Position, startPos: Position): number => {
  const dx = startPos.x - curPos.x;
  const dy = startPos.y - curPos.y;

  return Math.atan2(dy, dx);
};
export const angle = (radian: number): number => {
  return (radian * 180) / Math.PI;
};
export const findCoord = (d: number, a: number): Position => {
  const b = { x: 0, y: 0 };
  b.x = -(d * Math.cos(a));
  b.y = -(d * Math.sin(a));
  return b;
};
export const getDirection = (ang: number): DirectionType => {
  let direction: DirectionType = "left";

  if (ang > 45 && ang < 135) {
    direction = "up";
  } else if (ang > 135 && ang < 225) {
    direction = "right";
  } else if (ang > 225 && ang < 315) {
    direction = "down";
  }

  return direction;
};

/* 构建dom */
export const appleStyle = (node: HTMLElement, style: CSS.Properties<string | number>): void => {
  Object.assign(node.style, style);
};
export const buildDom = (instance: Joystick, zone: HTMLElement): void => {
  const { mode, currentJoystick, joystickSize, position, color, backImg } =
    instance;

  if (mode === "static") {
    zone.style.position = "relative";
  }

  const ui = document.createElement("div");
  const back = document.createElement("div");
  const front = document.createElement("div");
  currentJoystick.ui = ui;
  currentJoystick.back = back;
  currentJoystick.front = front;

  ui.setAttribute("class", "joystick_box");
  back.setAttribute("class", "back");
  front.setAttribute("class", "front");

  const uiStyle: CSS.Properties<string | number> = {
    position: "absolute",
    top:
      mode === "static"
        ? position.top
        : `${currentJoystick.y - joystickSize / 2}px`,
    left:
      mode === "static"
        ? position.left
        : `${currentJoystick.x - joystickSize / 2}px`,
    right: position.right,
    bottom: position.bottom,
    opacity: mode === "static" ? "0.5" : "1",
    transition: "opacity 100ms",
  };
  const backStyle: CSS.Properties = {
    width: `${joystickSize}px`,
    height: `${joystickSize}px`,
    backgroundColor: color.back !== "" ? color.back : "red",
    borderRadius: "100%",
  };
  const frontStyle: CSS.Properties = {
    width: `${joystickSize / 2}px`,
    height: `${joystickSize / 2}px`,
    backgroundColor: color.front !== "" ? color.front : "#fff",
    borderRadius: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    margin: `${joystickSize / 4}px 0 0 ${joystickSize / 4}px`,
    transform: "translate(0px, 0px)",
  };

  if (backImg.back !== "") {
    delete backStyle["backgroundColor"];
    backStyle["backgroundImage"] = `url(${backImg.back})`;
    backStyle["backgroundPosition"] = "center";
    backStyle["backgroundRepeat"] = "no-repeat";
    backStyle["backgroundSize"] = "100% 100%";
  }
  if (backImg.front !== "") {
    delete frontStyle["backgroundColor"];
    frontStyle["backgroundImage"] = `url(${backImg.front})`;
    frontStyle["backgroundPosition"] = "center";
    frontStyle["backgroundRepeat"] = "no-repeat";
    frontStyle["backgroundSize"] = "100% 100%";
  }

  appleStyle(ui, uiStyle);
  appleStyle(back, backStyle);
  appleStyle(front, frontStyle);

  ui.append(back, front);
  zone.appendChild(ui);
  currentJoystick.build = true;
};
