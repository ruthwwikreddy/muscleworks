import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";

const TransformSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Define transformation images
  // Note: Since the transformation folder is empty, we're using placeholder images
  // These should be replaced with actual transformation images once they're added
  const transformationImages = [
    "/images/transformation/Transformation (1).jpg",
    "/images/transformation/Transformation (2).jpg",
    "/images/transformation/Transformation (3).jpg",
    "/images/transformation/Transformation (4).jpg",
    "/images/transformation/Transformation (5).jpg",
  ];

  // Image carousel effect - change image every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === transformationImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000); // Change image every 1000ms (1 second)
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <section className="py-20 bg-black" id="transformation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-muscle-red">Transformations</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See the incredible results our members have achieved with dedication and our expert guidance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h3 className="text-3xl font-bold text-white">
              Transform Your Habits,{" "}
              <span className="text-muscle-red">Transform Your Life</span>
            </h3>
            <p className="text-gray-400 text-lg">
              At Muscle Works, we believe in the power of consistent effort and expert guidance.
              Our approach combines cutting-edge equipment, experienced trainers, and personalized
              programs to help you build habits that last a lifetime.
            </p>
            <p className="text-gray-400 text-lg">
              Join the hundreds of members who have already transformed their bodies and lives.
              Your success story is waiting to be written!
            </p>
            <Button className="bg-muscle-red hover:bg-muscle-red/90 animate-pulse-slow">
              Start Your Transformation
            </Button>
          </div>
          
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl bg-gray-900 flex items-center justify-center">
            {/* Image Carousel */}
            {transformationImages.map((image, index) => (
              <div key={index} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                <img
                  src={image}
                  alt={`Transformation ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
            
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {transformationImages.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-muscle-red' : 'bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformSection;