import { useEffect, useCallback, useState, useMemo } from 'react';

export default function useShortcuts(shortcutKeys, callback) {
  const lowerKeys = useMemo(() => shortcutKeys.map((k) => k.toLowerCase()), [shortcutKeys]);
  const [pressedKeys, setPressedKeys] = useState([]);

  const keyupListener = useCallback((e) => {
    const { key } = e;
    const testKey = key?.toLowerCase();
    if (pressedKeys.includes(testKey)) setPressedKeys(pressedKeys.filter((k) => k !== testKey));
  }, [pressedKeys]);

  const keydownListener = useCallback((e) => {
    const { key, repeat } = e;
    if (repeat) return;
    const testKey = key?.toLowerCase();
    if (pressedKeys.includes(testKey)) return;
    if (!pressedKeys[testKey]) {
      const nextKeys = [...pressedKeys, testKey];
      setPressedKeys(nextKeys);
      if (nextKeys.length === lowerKeys.length && nextKeys.every((v) => lowerKeys.indexOf(v) >= 0)) {
        // e.preventDefault();
        callback();
      }
    }
  }, [callback, pressedKeys, lowerKeys]);

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    window.addEventListener('keyup', keyupListener, true);
    return () => {
      window.removeEventListener('keydown', keydownListener, true);
      window.removeEventListener('keyup', keyupListener, true);
    };
  }, [keydownListener, keyupListener]);
}
