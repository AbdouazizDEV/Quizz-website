import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

const DELETE_THRESHOLD = 88;
const MAX_DRAG = 120;
const DIRECTION_LOCK = 8;

interface SwipeHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
}

export function useSwipeToDelete(onDelete: () => void, enabled = true) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const translateRef = useRef(0);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startTranslate: 0,
    active: false,
    locked: false,
  });

  const setOffset = useCallback((next: number) => {
    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, next));
    translateRef.current = clamped;
    setTranslateX(clamped);
  }, []);

  const reset = useCallback(() => {
    dragRef.current = {
      startX: 0,
      startY: 0,
      startTranslate: 0,
      active: false,
      locked: false,
    };
    setIsDragging(false);
    setOffset(0);
  }, [setOffset]);

  const finish = useCallback(() => {
    if (dragRef.current.locked && Math.abs(translateRef.current) >= DELETE_THRESHOLD) {
      onDelete();
    }
    reset();
  }, [onDelete, reset]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startTranslate: translateRef.current,
        active: true,
        locked: false,
      };
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.locked) {
        if (Math.abs(deltaX) < DIRECTION_LOCK && Math.abs(deltaY) < DIRECTION_LOCK) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
          drag.active = false;
          return;
        }
        drag.locked = true;
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      setOffset(drag.startTranslate + deltaX);
    },
    [setOffset],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      if (drag.locked && event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finish();
    },
    [finish],
  );

  const handlers: SwipeHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };

  return {
    translateX,
    isDragging,
    handlers,
  };
};
