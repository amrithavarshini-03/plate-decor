"use client";

import React, { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const render = () => {
      // Smooth linear interpolation for ring follower
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        ringRef.current.style.opacity = "1";
      }
      rafId = requestAnimationFrame(render);
    };

    const onMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.style.width = "20px";
        ringRef.current.style.height = "20px";
      }
    };

    const onMouseUp = () => {
      if (ringRef.current) {
        ringRef.current.style.width = "28px";
        ringRef.current.style.height = "28px";
      }
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hidden sm:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Smooth Lagging Follower Ring */}
      <div
        ref={ringRef}
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          position: "fixed",
          width: 28,
          height: 28,
          marginTop: -14,
          marginLeft: -14,
          border: "1.5px solid #E9A62B",
          borderRadius: "50%",
          backgroundColor: "rgba(233, 166, 43, 0.08)",
          boxShadow: "0 0 10px rgba(233, 166, 43, 0.2)",
          transition: "width 0.15s ease-out, height 0.15s ease-out, opacity 0.2s",
          willChange: "transform",
        }}
      />

      {/* Pinpoint Dot */}
      <div
        ref={dotRef}
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          position: "fixed",
          width: 6,
          height: 6,
          marginTop: -3,
          marginLeft: -3,
          borderRadius: "50%",
          backgroundColor: "#A8232F",
          boxShadow: "0 0 4px #E9A62B",
          border: "1px solid #FFFDF9",
          willChange: "transform",
        }}
      />
    </div>
  );
}
