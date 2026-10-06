import { animate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  /** Start counting from this value on mount (defaults to `value`). */
  from?: number;
  format?: (value: number) => string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  from,
  format = (current) => String(current),
  duration = 0.7,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(from ?? value);
  const currentRef = useRef(from ?? value);

  useEffect(() => {
    if (reduceMotion) {
      currentRef.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(currentRef.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        currentRef.current = latest;
        setDisplay(latest);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return <span>{format(Math.round(display))}</span>;
}
