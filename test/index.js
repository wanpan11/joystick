import Joystick from '../dist/index.js'

const joystick = new Joystick()

joystick.create({ zone: 'joystick', backImg: { back: './img/joystick_back.png', front: './img/joystick_frontPressed.png' } })

joystick.on('start', () => {
  console.log('start ===> ')
})

joystick.on('move', (e, i) => {
  console.log('move ===> ', i)
})
