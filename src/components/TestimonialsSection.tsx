import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Vijay Kumar",
    quote: "If you're serious about fitness and looking for a top-notch gym in Jubilee Hills, Muscle Works Gym is an excellent choice. The facility is clean, well-equipped, and designed to cater to all types of fitness enthusiasts, from beginners to athletes. The team of certified trainers provides personalized attention and tailored workout plans, ensuring you're on the right track. The management is professional, approachable, and ensures the gym is well-maintained with regularly updated equipment.",
    image: "/assets/images/Gym (2).png",
  },
  {
    name: "Ashfaq Ahmad",
    quote: "This gym is truly exceptional—it feels like you've stepped out of India and into a world-class fitness center. The energetic vibe, state-of-the-art equipment, and supportive trainers make every workout a fantastic experience. The convenient location is just the cherry on top.",
    image: "/assets/images/Gym (2).png",
  },
  {
    name: "Sai Akhil",
    quote: "Muscle Works stands out as a premier gym in Hyderabad, offering exceptional workout experiences. The sophisticated equipment is both effective and user-friendly, and the inspiring atmosphere motivates me to achieve my fitness milestones. The staff is approachable and always ready to provide guidance and advice. I highly recommend this outstanding fitness facility.",
    image: "/assets/images/Gym (2).png",
  },
  {
    name: "Sadashiv Simha",
    quote: "The best coaches and best training are given to each individual. Fully branded equipment, premium facilities, and a prime location at very nominal rates. The coach doesn't compromise when it comes to training. A place where we go from \"fit less\" to fitness!",
    image: "/assets/images/Gym (2).png",
  },
  {
    name: "G.S. Arora",
    quote: "Finding a gym that offers not only the latest in fitness equipment but also an inspiring atmosphere can be a game-changer. Muscle Works Gym combines top-notch hygiene, a vibrant culture, and friendly staff to create an exceptional workout environment. This gym truly sets a high standard for fitness centers in Hyderabad and Secunderabad.",
    image: "/assets/images/Gym (2).png",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-black" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-heading text-white">
            What Our Clients Say About Our Services
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-8">
            Real stories from real people who have transformed their lives with us
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:text-muscle-red transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-muscle-red rounded-full p-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-12"
                >
                  <div className="testimonial-card animate-zoom-in">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-2 border-muscle-red image-hover"
                    />
                    <p className="text-gray-600 text-lg mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-bold text-black text-xl">{testimonial.name}</h3>
                      <p className="text-muscle-red mt-1">Verified Member</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-muscle-red transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-muscle-red rounded-full p-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-muscle-red" : "bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;