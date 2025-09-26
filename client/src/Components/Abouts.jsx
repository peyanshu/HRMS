import { motion } from "framer-motion";
import React from "react";

const Abouts = () => {
  return (
    <>
      {/* Top Section with Images */}
      <div className="w-full min-h-screen text-black relative bg-white">
        <div className="relative w-full h-[60vw]">
          {/* Image 1 */}
          <img
            data-scroll
            data-scroll-speed=".4"
            className="absolute left-4 sm:left-16 top-8 h-[65%] sm:h-[50%] object-cover"
            src="https://a.storyblok.com/f/133769/1500x2123/637f850b2b/exo-ape-studio-collage-1.jpg/m/450x637/filters:format(webp):quality(70)"
            alt=""
          />
          {/* Image 2 */}
          <img
            data-scroll
            data-scroll-speed=".4"
            className="absolute left-1/2 -translate-x-1/2 top-24 sm:top-36 h-[35%] sm:h-[34%] w-auto object-cover"
            src="https://a.storyblok.com/f/133769/1500x1003/2581b1d31d/exo-ape-studio-collage-2.jpg/m/450x301/filters:format(webp):quality(70)"
            alt=""
          />
          {/* Image 3 */}
          <img
            data-scroll
            data-scroll-speed=".3"
            className="absolute right-6 sm:right-16 top-40 sm:top-56 h-[50%] sm:h-[30%] object-cover"
            src="https://a.storyblok.com/f/133769/569x809/dd3f38466e/exo-ape-studio-collage-3.jpg/m/450x640/filters:format(webp):quality(70)"
            alt=""
          />
        </div>

        {/* Heading */}
        <h1 className="absolute w-[90%] sm:w-[70%] md:w-[50%] left-1/2 -translate-x-1/2 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug font-medium text-center sm:text-left top-[70%]">
          We partner with brands and businesses that create exceptional
          experiences where people live, work and unwind.
        </h1>
      </div>

      {/* Subtext Section */}
      <div className="w-full h-auto py-12 bg-white text-black flex justify-center">
        <h1 className="w-[90%] sm:w-[70%] md:w-[40%] text-xs sm:text-sm md:text-base leading-snug text-center sm:text-left opacity-60">
          Interior Design & Furniture • Architecture & Real Estate • Hospitality,
          Travel & Tourism
        </h1>
      </div>

      {/* Marquee Section */}
      <div className="bg-black w-full h-screen overflow-hidden flex items-center">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{ ease: "linear", repeat: Infinity, duration: 10 }}
          className="marquee flex whitespace-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <h1
              key={i}
              className="text-[12vw] flex items-center gap-8 px-8 text-white"
            >
              Forever upwards
              <svg
                viewBox="0 0 169 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 sm:w-28 -mb-4"
              >
                <path
                  d="M132 78C117.5 78 101.667 68.9167 84.5 50.75C84 51.25 82 53.0833 78.5 56.25C75.1667 59.25 73 61.1667 72 62C71.1667 62.6667 69.25 64.1667 66.25 66.5C63.4167 68.8333 61.0833 70.4167 59.25 71.25C57.5833 72.0833 55.4167 73.1667 52.75 74.5C50.0833 75.8333 47.4167 76.75 44.75 77.25C42.25 77.5833 39.5833 77.75 36.75 77.75C25.75 77.75 16.8333 74.1667 10 67C3.33333 59.8333 0 50.6667 0 39.5C0 28.5 3.25 19.25 9.75 11.75C16.4167 4.25 25.25 0.500001 36.25 0.500001C42.5833 0.500001 48.9167 2.16667 55.25 5.5C61.75 8.83333 66.6667 12 70 15C73.3333 18 78.1667 22.6667 84.5 29C85 28.5 86.4167 27.0833 88.75 24.75C91.25 22.25 92.8333 20.6667 93.5 20C94.3333 19.3333 95.8333 17.9167 98 15.75C100.333 13.5833 102 12.1667 103 11.5C104.167 10.6667 105.833 9.5 108 8C110.167 6.33334 112 5.16667 113.5 4.5C115.167 3.83333 117 3.08333 119 2.25C121.167 1.41667 123.25 0.833335 125.25 0.500001C127.417 0.166667 129.583 0 131.75 0C142.75 0 151.667 3.66667 158.5 11C165.333 18.3333 168.75 27.5833 168.75 38.75C168.75 50.0833 165.417 59.5 158.75 67C152.083 74.3333 143.167 78 132 78Z"
                  fill="currentColor"
                />
              </svg>
            </h1>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Abouts;
