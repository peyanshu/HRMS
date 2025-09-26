  import React, { useEffect, useRef } from "react";
  import { motion } from "framer-motion";

  const Wheel = () => {
    const textRef = useRef(null);
useEffect(() => {
  const text = textRef.current;
  if (text) {
    const content = text.innerText;
    const chars = content.split("");
    const totalChars = chars.length;

    // const outerRadius = 100;  // matches half of outer circle (200px/2)
    const innerRadius = 70;   // smaller → keeps text inside the circle
    const angle = 360 / totalChars;

    text.innerHTML = chars
      .map(
        (char, i) =>
          `<span 
             class="absolute text-black text-[16px]" 
             style="transform: rotate(${i * angle}deg) translate(${innerRadius}px); transform-origin: 0 0;"
           >${char}</span>`
      )
      .join("");
  }
}, []);



    return (
   <div className="relative w-[200px] h-[200px] text-black">
      {/* Outer Circle */}
      <div className="relative w-full h-full rounded-full border-2 
      border-gray-400 flex items-center justify-center">
        
        {/* Inner Circle with Logo */}
        <div className="absolute w-[140px] h-[140px] rounded-full border border-gray-300 flex items-center justify-center bg-orange-300 shadow-md">
          <img src="/logo.png" alt="logo" className="w-full h-auto object-contain" />
        </div>

        {/* Rotating Text */}
        <svg className="absolute w-full h-full animate-rotateText">
          <defs>
            {/* Circle path (inside outer border) */}
            <path
              id="circlePath"
              d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
            />
          </defs>
          <text className="fill-gray-700 font-medium tracking-wide text-[14px]">
            <textPath href="#circlePath" startOffset="0%" textAnchor="middle">
              WhiteCircle → HRMS → WhiteCircle → HRMS →
              
              WhiteCircle → HRMS → WhiteCircle → HRMS →
              
              WhiteCircle → HRMS → WhiteCircle → HRMS →
            </textPath>
          </text>
        </svg>
      </div>
    </div>

    );
  };

  const Data = () => {
    return (
      <div className="w-full min-h-screen bg-white text-black  font-semibold flex flex-col lg:flex-row items-center justify-center gap-1 p-1">
        {/* Left Side: Animated Text */}
        <div className="w-full lg:w-1/2 ml-10 pl-6">
          {["Data", "Informs", "Emotion", "Convert"].map((word, index) => {
            return (
              <div className="overflow-hidden" key={index}>
                <motion.h1
                  className="
                    text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                    leading-tight sm:leading-[8vw] md:leading-[7vw] 
                    lg:leading-[6vw] 
                    tracking-tighter
                    break-words
                  "
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                >
                  {index === 2 ? (
                    <span className="inline-block mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.h1>
              </div>
            );
          })}
        </div>

        {/* Right Side: Wheel */}
        <div className="w-full lg:w-1/2 flex  items-center justify-center">
          <Wheel />
        </div>
      </div>
    );
  };

  export default Data;
