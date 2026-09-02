"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });

  const updateInteractives = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseEnterInteractive = () => cursor.classList.add("hovering");
    const onMouseLeaveInteractive = () => cursor.classList.remove("hovering");

    const interactives = document.querySelectorAll(
      "a, button, input, textarea, [data-cursor-hover]"
    );
    interactives.forEach((el) => {
      el.removeEventListener("mouseenter", onMouseEnterInteractive);
      el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      cursor.style.left = `${mousePos.current.x}px`;
      cursor.style.top = `${mousePos.current.y}px`;

      // Trail follows with easing
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.15;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.15;
      trail.style.left = `${trailPos.current.x}px`;
      trail.style.top = `${trailPos.current.y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    // Initial setup
    updateInteractives();

    // Watch for DOM changes to re-bind interactives
    const observer = new MutationObserver(() => {
      updateInteractives();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [updateInteractives]);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={trailRef} className="cursor-trail" />
    </>
  );
}
