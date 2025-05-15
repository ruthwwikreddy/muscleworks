import { Dumbbell, Users, Heart, Brain, Activity, Bike } from "lucide-react";

const services = [
  {
    title: "Personalized Training Plans",
    description: "Custom workout plans tailored to your goals and fitness level",
    icon: Dumbbell,
    bgColor: "bg-black",
  },
  {
    title: "Expert Trainers",
    description: "Work with certified professionals who guide your fitness journey",
    icon: Users,
    bgColor: "bg-black/90",
  },
  {
    title: "State-of-the-Art Equipment",
    description: "Premium fitness equipment for optimal workout experience",
    icon: Dumbbell,
    bgColor: "bg-black/80",
  },
  {
    title: "Nutrition Guidance",
    description: "Expert advice on diet and nutrition to support your goals",
    icon: Heart,
    bgColor: "bg-black",
  },
  {
    title: "Flexible Membership Option",
    description: "Choose from various membership plans that suit your needs",
    icon: Activity,
    bgColor: "bg-black/90",
  },
  {
    title: "Wellness Programs",
    description: "Comprehensive programs for overall health and well-being",
    icon: Heart,
    bgColor: "bg-black/80",
  },
  {
    title: "Sustainability Practices",
    description: "Eco-friendly approach to fitness and wellness",
    icon: Brain,
    bgColor: "bg-black",
  },
  {
    title: "Group Classes for All Levels",
    description: "Diverse range of group fitness classes for every fitness level",
    icon: Users,
    bgColor: "bg-black/90",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-black/90" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            We Offer Exclusive Services
          </h2>
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-8">
              For Build Health
            </h3>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-muscle-red"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.bgColor} p-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10`}
            >
              <div className="flex flex-col items-center text-white">
                <service.icon className="w-12 h-12 mb-4 text-muscle-red" />
                <h3 className="text-xl font-bold text-center mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-center text-gray-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
