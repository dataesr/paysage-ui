import { useRef } from 'react';

export default function useSubmitGuard(handler) {
  const running = useRef(false);
  return async (...args) => {
    if (running.current) return undefined;
    running.current = true;
    try {
      return await handler(...args);
    } finally {
      running.current = false;
    }
  };
}
