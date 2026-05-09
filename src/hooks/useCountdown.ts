import { useEffect, useState } from 'react';
import { type Countdown, getCountdown } from '../lib/date';

export function useCountdown(targetIso: string): Countdown {
  const [countdown, setCountdown] = useState(() => getCountdown(targetIso));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(targetIso));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetIso]);

  return countdown;
}
