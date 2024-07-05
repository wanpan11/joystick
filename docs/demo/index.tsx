import Joystick from 'joystick-kit';
import React, { useEffect } from 'react';

export default function Demo() {
  useEffect(() => {
    const joystick = new Joystick();
    joystick.create({ mode: 'static', zone: 'joystick' });
  }, []);

  return (
    <div
      id="joystick"
      style={{ width: '100%', height: 300, background: '#565aff' }}
    />
  );
}
