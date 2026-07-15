import { useState, useEffect, useRef } from "react";

export default function RevealOnScroll({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observedNode = ref.current;
    if (!observedNode) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08 });

    scrollObserver.observe(observedNode);

    return () => scrollObserver.disconnect();
  }, []);

  return <div ref={ref} className={`reveal-on-scroll${isVisible ? " is-visible" : ""}`}>{children}</div>;
}
