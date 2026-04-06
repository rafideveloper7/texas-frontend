"use client";

import { useEffect, useRef } from "react";

export default function GsapReveal({
  children,
  className,
  y = 40,
  delay = 0,
  scrub = false,
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    let ctx;

    async function setupAnimation() {
      // Respect reduced-motion and avoid loading GSAP at all when motion should
      // be minimized.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !elementRef.current) {
        return;
      }

      // Lazy-loading keeps GSAP out of the critical path for the initial page load.
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
      const ScrollTrigger =
        scrollTriggerModule.ScrollTrigger ||
        scrollTriggerModule.default ||
        scrollTriggerModule;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Most sections reveal once; scrub is available for the few places where
        // scroll-linked motion feels useful.
        gsap.fromTo(
          elementRef.current,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: scrub ? 1 : 0.9,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elementRef.current,
              start: "top 85%",
              once: !scrub,
              scrub: scrub ? 0.8 : false,
            },
          }
        );
      }, elementRef);
    }

    setupAnimation();

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [delay, scrub, y]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
