import { Check } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Monthly",
    price: "₹5,000",
    features: ["Full Gym Access", "Personal Trainer", "Group Classes", "Locker Access"],
  },
  {
    name: "Quarterly",
    price: "₹11,999",
    features: ["All Monthly Features", "Nutrition Plan", "Free Supplements", "Guest Passes"],
    popular: true,
  },
  {
    name: "Half-Yearly",
    price: "₹15,999",
    features: ["All Quarterly Features", "Personal Coach", "Recovery Sessions", "VIP Access"],
  },
  {
    name: "Yearly",
    price: "₹19,999",
    features: ["All Features Included", "Priority Booking", "Free Merchandise", "Special Events"],
  },
];

const MembershipSection = () => {
  return (
    <section className="py-20 bg-black" id="membership">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kickstart 2025 with Amazing{" "}
            <span className="text-muscle-red">Fitness Deals!</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your fitness journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-lg ${
                plan.popular
                  ? "bg-muscle-red text-white"
                  : "bg-white text-black"
              } relative transform hover:scale-105 transition-transform duration-300 shadow-xl`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-black hover:bg-black/90"
                    : "bg-muscle-red hover:bg-muscle-red/90"
                }`}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;