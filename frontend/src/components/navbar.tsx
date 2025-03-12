import React from "react";
import { Search } from "lucide-react";
import { SearchForm } from "./search-form";
import cat from "../assets/cat-logo.svg";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <div className={`sticky top-0 w-full bg-[#191970] text-white font-sans z-10 shadow-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[5%]">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center gap-2 md:gap-8">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <a href="/home" className="block">
                <img 
                  className="h-10 md:h-14" 
                  loading="lazy" 
                  src={cat}
                  alt="Marketplace logo" 
                />
              </a>
            </div>
            
            {/* Navigation for larger screens */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-4 lg:space-x-8">
                {['Figures', 'Plushies', 'Trading Cards', 'Retro', 'Goods'].map((item) => (
                  <li key={item}>
                    <a 
                      href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-base lg:text-lg font-bold transition-colors duration-300 hover:text-gray-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Right Side - Search and Cart */}
          <div className="flex items-center gap-4">
            {/* Search section */}
            <div className="flex items-center">
              <span className="flex items-center justify-center">
                <Search size={20} className="text-white" />
              </span>
              <SearchForm />
            </div>
            
            {/* Cart Component */}
           
            
            {/* Mobile Navigation Button */}
            <button className="md:hidden focus:outline-none" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Hidden by default */}
        <div className="hidden md:hidden pb-4">
          <ul className="flex flex-col space-y-3">
            {['Figures', 'Plushies', 'Trading Cards', 'Retro', 'Goods'].map((item) => (
              <li key={item}>
                <a 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="block text-lg font-bold transition-colors duration-300 hover:text-gray-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;