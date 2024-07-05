import Joystick from 'joystick-kit';
import React, { useEffect } from 'react';
import back from '../../public/img/joystick_back.png';
import front from '../../public/img/joystick_frontPressed.png';

export default function Demo() {
  useEffect(() => {
    const joystick = new Joystick();
    joystick.create({
      mode: 'static',
      zone: 'joystick',
      size: 120,
      position: { top: 'calc(50% - 60px)', left: 'calc(50% - 60px)' },
      backImg: {
        back: back,
        front: front,
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
