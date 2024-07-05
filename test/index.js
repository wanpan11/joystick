import Joystick from '../dist/index.js'

const joystick = new Joystick()

joystick.create({
  mode: 'static',
  zone: 'joystick',
  position: { bottom: '30%', left: '30%' },
  backImg: {
    back: './img/joystick_back.png',
    front: './img/joystick_frontPressed.png'
  }
})

joystick.on('start', () => {
  console.log('start ===> ')
})

joystick.on('move', (e, i) => {
  console.log('move ===> ', i)
})

joystick.on('end', (e, i) => {
  console.log('end ===> ', i)
})
