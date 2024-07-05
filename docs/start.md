---
nav:
  title: start
---

# usage | 使用说明

### install

```shell
npm i joystick-kit
```

### usage

```ts
import Joystick from 'joystick-kit';

const joystick = new Joystick();
joystick.create({
  mode: 'static',
  zone: 'joystick',
  size: 120,
  position: { top: 'calc(50% - 60px)', left: 'calc(50% - 60px)' },
  backImg: {
    back: '/img/joystick_back.png',
    front: '/img/joystick_frontPressed.png',
  },
});
```

### joystick.create

```ts
type CreateConfig {
  mode: "dynamic" | "static",
  zone: string; // Set up the mount node
  size?: number; // Set the size of the handle
  color?: { back: string; front: string }; // Set a background color
  backImg?: { back: string; front: string }; // Set a background image (Takes precedence over color)
  position?: { // Set the handle positioning
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
}
```

### joystick.on

```ts
(type: 'start' | 'move' | 'end', cb: (e: Event, info?: { direction: DirectionType; ang: number }) => void)
```
