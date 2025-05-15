import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone } from "lucide-react";
import { useForm } from "@formspree/react";
import { z } from "zod";

// Formspree form ID
const FORMSPREE_FORM_ID = "xnndlggd";

// Define form validation schema
const trialFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  gender: z.string().min(1, { message: "Please select your gender" }),
});

type FormData = z.infer<typeof trialFormSchema>;

const FreeTrialSection = () => {
  const { toast } = useToast();
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = trialFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);
      return;
    }
    
    if (!validatePhoneNumber(formData.phone)) {
      setErrors(prev => ({
        ...prev,
        phone: "Please enter a valid 10-digit Indian mobile number"
      }));
      return;
    }

    // Submit to Formspree
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    await handleSubmit(formDataToSubmit as any);

    if (state.succeeded) {
      toast({
        title: "Free Trial Booked!",
        description: "We'll contact you shortly to confirm your trial session.",
      });
      setFormData({ name: "", email: "", phone: "", gender: "" });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="free-trial">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-4xl font-bold text-black mb-6 relative">
              Book a Free Two-Day Trial and Experience Our Gym!
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-muscle-red"></span>
            </h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600 hover:text-muscle-red transition-colors">
                <span className="w-2 h-2 bg-muscle-red rounded-full mr-3"></span>
                Meet Our Expert Trainers
              </li>
              <li className="flex items-center text-gray-600 hover:text-muscle-red transition-colors">
                <span className="w-2 h-2 bg-muscle-red rounded-full mr-3"></span>
                Explore Our State-of-the-Art Facilities
              </li>
              <li className="flex items-center text-gray-600 hover:text-muscle-red transition-colors">
                <span className="w-2 h-2 bg-muscle-red rounded-full mr-3"></span>
                Join Exciting Group Classes
              </li>
            </ul>
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Trainer with client"
              className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fade-up"
            />
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg animate-fade-up">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Book Your Free Trial</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent`}
                />
              </div>
              {errors.phone ? (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Enter a valid 10-digit Indian mobile number</p>
              )}
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent`}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-muscle-red hover:bg-muscle-red/90 transition-colors py-6 text-lg"
              disabled={state.submitting}
            >
              {state.submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : 'Book Free Trial'}
            </Button>
            {state.errors && (
              <p className="text-red-500 text-sm mt-2">
                Oops! Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialSection;