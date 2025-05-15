import { Facebook, Instagram, Linkedin, Youtube, MapPin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/muscle_works_the_fitness/p/C86XWIspgQu/",
      label: "Instagram"
    },
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/people/Muscle-Works-The-Fitness-Coliseum/61560460897988/",
      label: "Facebook"
    },
    { 
      icon: Youtube, 
      href: "http://www.youtube.com/@MWthefitnesscoliseum",
      label: "YouTube"
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/company/muscle-works/posts/?feedView=all",
      label: "LinkedIn"
    },
    { 
      icon: MapPin, 
      href: "https://maps.app.goo.gl/iQ5DM66kghrAGJe5A",
      label: "Location"
    }
  ];

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Membership", href: "#membership" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Muscle Works</h3>
            <p className="text-gray-400">
              Your ultimate fitness destination in Jubilee Hills.
            </p>
            <div className="mt-4">
              <p className="text-gray-400">
                <span className="font-bold text-white">Phone:</span> +91-9281151518
              </p>
              <p className="text-gray-400">
                <span className="font-bold text-white">Address:</span> Muscle Works - The Fitness Coliseum
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Muscle Works – All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;