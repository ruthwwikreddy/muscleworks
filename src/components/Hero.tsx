
import React from "react";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center">
      {/* Background with image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/Gym (1).png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          Unleash Your Inner Strength
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Transform your body and mind with our expert fitness programs.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#services"
            className="bg-muscle-red text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition-colors duration-300"
          >
            Explore Services
          </a>
          <a
            href="#contact"
            className="bg-transparent border border-white text-white py-3 px-6 rounded-full font-semibold hover:bg-white hover:text-muscle-red transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
