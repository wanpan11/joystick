import Joystick from 'joystick-kit';
import React, { useEffect } from 'react';

export default function Demo() {
  useEffect(() => {
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

    joystick.on('move', (e, info) => {
      console.log(e);
      console.log(info);
    });
  }, []);

  return (
    <div
      id="joystick"
      style={{ width: '100%', height: 300, background: '#565aff' }}
    />
  );
}
