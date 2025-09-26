import React from "react";
import Data from "./Data";
import Abouts from "./Abouts";

const Landing = () => {
 
  return (
   <>
    <div className="w-full relative overflow-hidden bg-zinc-900">
      {/* Background Image */}
      <img
       
        className="w-full h-screen bg-fixed bg-center bg-cover opacity-80"
        src="https://a.storyblok.com/f/133769/2500x2626/63a902ce2b/exo-ape-studio-hero.jpg/m/1920x2017/filters:format(jpeg):quality(70)"
        srcSet="
          https://a.storyblok.com/f/133769/2500x2626/63a902ce2b/exo-ape-studio-hero.jpg/m/1024x1076/filters:format(jpeg):quality(70) 1024w,
          https://a.storyblok.com/f/133769/2500x2626/63a902ce2b/exo-ape-studio-hero.jpg/m/1280x1345/filters:format(jpeg):quality(70) 1280w,
          https://a.storyblok.com/f/133769/2500x2626/63a902ce2b/exo-ape-studio-hero.jpg/m/1920x2017/filters:format(jpeg):quality(70) 1920w
        "
        sizes="(max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px"
        width="2500"
        height="2626"
        alt="exo ape"
        loading="eager"
       
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-32 text-white font-['gilroy']">
        {/* Main Title */}
        <div className="maintxt"
        
        >
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6vw] leading-none tracking-tight font-normal">
          HRMS
          </h1>
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6vw] leading-none tracking-tight font-normal">
            Whitecircle
          </h1>
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6vw] leading-none tracking-tight font-normal">
          Group
          </h1>

          <p className="py-4 md:py-6 lg:py-8 text-xs sm:text-sm md:text-base lg:text-lg max-w-md">
           Transforming HR into a seamless experience
          </p>
        </div>

        {/* Supporting Paragraph */}
        <p className="mt-6 md:mt-10 lg:mt-14 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl">
            Our HRMS platform streamlines every aspect of workforce management — from 
  onboarding and attendance to payroll and performance tracking. Designed to 
  simplify HR operations, it empowers organizations to focus on people, not 
  paperwork. With intuitive tools and real-time insights, we help businesses 
  improve efficiency, enhance employee engagement, and drive growth.</p>
      </div>
    </div>
    <Abouts/>
    <Data/>
   </>
  );
};

export default Landing;
