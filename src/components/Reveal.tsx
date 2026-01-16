import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  threshold?: number;
  delay?: number;
  width?: "fit-content" | "100%";
}

export default function Reveal({ children, threshold = 0.1, delay = 0, width = "100%" }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{
        width,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s cubic-bezier(0.5, 0, 0, 1) ${delay}s, transform 0.8s cubic-bezier(0.5, 0, 0, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
}
