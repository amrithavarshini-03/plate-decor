"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface GarlandDividerProps {
  className?: string;
  variant?: "marigold-leaf" | "delicate-string";
}

export function GarlandDivider({ className = "", variant = "marigold-leaf" }: GarlandDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`w-full py-6 flex items-center justify-center overflow-hidden ${className}`}>
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <svg
          viewBox="0 0 1000 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-16 overflow-visible"
        >
          {/* Main Thoranam Thread connecting auspicious festoons */}
          <motion.path
            d="M0 12 C 125 34, 175 34, 250 12 C 375 34, 425 34, 500 12 C 625 34, 675 34, 750 12 C 875 34, 925 34, 1000 12"
            stroke="#C8A86B"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Hanging Mango Leaves and Marigold Flowers at each festoon node */}
          {[125, 250, 375, 500, 625, 750, 875].map((x, index) => {
            const isCenterFlower = index % 2 === 1;
            const yNode = isCenterFlower ? 12 : 28;

            return (
              <motion.g
                key={index}
                initial={{ scale: 0, opacity: 0, y: -8 }}
                animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: -8 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="origin-top"
              >
                {/* Mango leaf (Mavilai) hanging downward */}
                <path
                  d={`M${x - 8} ${yNode} C ${x - 12} ${yNode + 18}, ${x - 4} ${yNode + 34}, ${x} ${yNode + 40} C ${x + 4} ${yNode + 34}, ${x + 12} ${yNode + 18}, ${x + 8} ${yNode} Z`}
                  fill={index % 2 === 0 ? "#2F5D3A" : "#244A2D"}
                  stroke="#1D3B24"
                  strokeWidth="0.8"
                />

                {/* Leaf central spine */}
                <line
                  x1={x}
                  y1={yNode}
                  x2={x}
                  y2={yNode + 36}
                  stroke="#427E51"
                  strokeWidth="0.8"
                />

                {/* Marigold Blossom tied onto the leaf */}
                <circle cx={x} cy={yNode + 8} r="6.5" fill="#E9A62B" />
                <circle cx={x} cy={yNode + 8} r="4.5" fill="#F3B94D" />
                <circle cx={x} cy={yNode + 8} r="2" fill="#A8232F" />
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
