
import { useEffect, useRef } from 'react';

export const useKeyboard = () => {
  const keyMap = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keyMap.current[event.key] = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keyMap.current[event.key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return keyMap;
};
