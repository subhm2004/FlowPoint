import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fast at first, easing to a stop — a linear count looks mechanical.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from 0 to `to` the first time it is scrolled into view. */
export const CountUp = ({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));
  const started = useRef(prefersReducedMotion());

  useEffect(() => {
    const node = ref.current;
    if (!node || started.current) return;

    let fallback: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();

      // If rAF never runs — throttled background tab, reduced-motion engines, a
      // headless renderer — the number would otherwise freeze part-way and the page
      // would claim something false ("0 roles"). Land on the real value regardless.
      fallback = setTimeout(() => setValue(to), duration + 400);

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setValue(Math.round(easeOut(progress) * to));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          clearTimeout(fallback);
        }
      };
      requestAnimationFrame(tick);
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
};

export default CountUp;
