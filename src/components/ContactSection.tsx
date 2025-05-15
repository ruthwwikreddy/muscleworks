import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "@formspree/react";
import { useToast } from "@/hooks/use-toast";

// Formspree form ID
const FORMSPREE_FORM_ID = "mnndlgvz";

const ContactSection = () => {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const { toast } = useToast();

  if (state.succeeded) {
    return (
      <section className="py-20 bg-gray-50" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Your message has been sent successfully. We'll get back to you soon!
          </p>
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-muscle-red hover:bg-muscle-red/90"
          >
            Back to Top
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Get In Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our services or want to schedule a visit? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-muscle-red/10 p-2 rounded-full">
                  <MapPin className="w-6 h-6 text-muscle-red" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Our Location</h3>
                  <p className="text-gray-600">
                    Level 4, Pavani Equinox, Road Number 10, Jubilee Hills, Hyderabad, Telangana 500033
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-muscle-red/10 p-2 rounded-full">
                  <Phone className="w-6 h-6 text-muscle-red" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Contact</h3>
                  <p className="text-gray-600">+91-9281151518</p>
                  <p className="text-gray-600">+91-9100000000</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-muscle-red/10 p-2 rounded-full">
                  <Mail className="w-6 h-6 text-muscle-red" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email Us</h3>
                  <p className="text-gray-600">admin@mwthefitnesscoliseum.in</p>
                  <p className="text-gray-600">info@mwthefitnesscoliseum.in</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-muscle-red/10 p-2 rounded-full">
                  <Clock className="w-6 h-6 text-muscle-red" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Working Hours</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Monday - Saturday:</span> 6:00 AM - 10:00 PM
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Sunday:</span> 7:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.314293610508!2d78.4082!3d17.4476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c24f1d1e5f%3A0x3a9b11fe2aafb1b2f!2sMuscle%20Works%20The%20Fitness%20Coliseum!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Muscle Works Location"
                className="rounded-xl"
              />
            </div>
          </div>
          
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
            <p className="text-gray-600 mb-6">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Include country code if outside India</p>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-muscle-red focus:border-transparent"
              />
              <p className="text-gray-500 text-xs mt-1">
                Please provide as much detail as possible
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-muscle-red hover:bg-muscle-red/90 text-white py-6 text-base font-medium transition-colors"
              disabled={state.submitting}
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </Button>
            
            {state.errors && (
              <p className="text-red-500 text-sm mt-2">
                Oops! Something went wrong. Please try again.
              </p>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll never share your information with anyone else.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;