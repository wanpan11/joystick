# joystick
🎮 Virtual joystick 虚拟摇杆

---

### install
```
pnpm add joystick-kit
```

### dome
``` javascript
import Joystick from "joystick-kit";

/*  create instance */
const joystick = new Joystick()

/*  create joystick */
joystick.create({ zone: 'joystick' })

/* event */
joystick.on('start', () => {
  console.log('start ===> ')
})
```




# API
### create
```typescript
interface CreateConfig {
  zone: string // 挂载节点
  size?: number // 摇杆大小
  color?: { back: string, front: string } // 摇杆颜色
  backImg?: { back: string, front: string } // 摇杆背景图
}
``` 
backImg 优先于 color


### on
```typescript
interface EventType {
  start: string
  move: string
  end: string
};
```
