import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import cat from "@/assets/cat-logo.svg";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const year = new Date().getFullYear();

  return (
    <footer className={` mt-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[5%] py-8">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              {["Our Story", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {["Contact Us", "FAQs", "Shipping", "Returns"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Accessibility",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:marketplace@gmail.com"
                  className="hover:text-gray-300 transition-colors duration-300"
                >
                  marketplace@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:+1234567890"
                  className="hover:text-gray-300 transition-colors duration-300"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  123 Marketplace St.
                  <br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social media */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 py-6 border-t border-b border-gray-700">
          <h2 className="font-bold text-lg">Follow Us</h2>
          <div className="flex gap-6">
            {[
              { icon: <Instagram size={20} />, label: "Instagram" },
              { icon: <Facebook size={20} />, label: "Facebook" },
              { icon: <Twitter size={20} />, label: "Twitter" },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300 transition-colors duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Logo and copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src={cat}
              alt="Marketplace Logo"
              className="h-12 w-12"
            />
            <span className="font-bold text-lg">The Geek Shop</span>
          </div>
          <p className="text-sm ">
            © {year} The Geek Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
