# joystick
🎮 Virtual joystick 虚拟摇杆

---

### 安装
```
pnpm add joystick-kit
```

### 使用
``` javascript

const joystick = new Joystick()

/*  create instance */
joystick.create({ zone: 'joystick' })

/* event */
joystick.on('start', () => {
  console.log('start ===> ')
})
```

### Event
- start
- move
- end
