
import React from "react";
import { cn } from "@/lib/utils";

const AuthorBadge = () => {
  return (
    <a
      href="https://ruthwikreddy.xyz"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-50 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative px-4 py-2 w-auto flex items-center">
        {/* Background blurred image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/Gym (1).png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 backdrop-blur-md bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative flex items-center space-x-2 z-10">
          <span className="text-white text-sm">
            Made by{" "}
            <span className="font-bold text-muscle-red group-hover:underline transition-all">
              Ruthwik Reddy
            </span>
          </span>
        </div>
      </div>
    </a>
  );
};

export default AuthorBadge;
