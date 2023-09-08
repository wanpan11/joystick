# joystick 虚拟摇杆 

🎮 Virtual joystick 虚拟摇杆

![image](https://github.com/wanpan11/joystick/assets/38714194/67e937a2-92c6-4964-98f8-425d1010ffcc)


---

### install

```
pnpm add joystick-kit
```

### dome

```javascript
import Joystick from "joystick-kit";

/*  create instance */
const joystick = new Joystick();

/*  create joystick */
joystick.create({ zone: "joystick" });

/* event */
joystick.on("start", () => {
  console.log("start ===> ");
});
```

# API

### create

```typescript
interface CreateConfig {
  mode: string; // 挂载模式 static | dynamic
  zone: string; // 挂载节点
  size?: number; // 摇杆大小
  position: { top: string; left: string; right: string; bottom: string }; //组件定位 dynamic 模式下无效
  color?: { back: string; front: string }; // 摇杆颜色
  backImg?: { back: string; front: string }; // 摇杆背景图
}
```

backImg 优先于 color

---

### on

```typescript
// event keys
interface EventType {
  start: string;
  move: string;
  end: string;
}

//  event params
interface MoveInfo {
  direction: string;
  ang: number;
}
interface EventObj {
  start: null | ((Event, Joystick) => void);
  move: null | ((Event, { direction, ang }: MoveInfo) => void);
  end: null | ((Event, Joystick) => void);
}
```

<a href='./index.d.ts'>类型参考</a>
