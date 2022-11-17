import Joystick from '../dist/index.js'

const joystick = new Joystick()

joystick.create({ zone: 'joystick' })
joystick.on('start', () => {
  console.log('start ===> ')
})
