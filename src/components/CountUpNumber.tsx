import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUpNumber = forwardRef<HTMLSpanElement, CountUpNumberProps>(
  function CountUpNumber({ end, duration = 1.5, suffix = '', className = '' }, _ref) {
    const innerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(innerRef, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;
      const startTime = performance.now();
      const step = (time: number) => {
        const elapsed = (time - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(end * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return (
      <motion.span
        ref={innerRef}
        className={className}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {count}{suffix}
      </motion.span>
    );
  }
);

CountUpNumber.displayName = 'CountUpNumber';

export default CountUpNumber;
