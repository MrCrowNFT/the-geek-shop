import React, { useState } from "react";
import { SearchForm } from "./search-form";
import cat from "../assets/cat-logo.svg";
import Cart from "./cart";
import Sidebar from "./user-sidebar";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`sticky top-0 w-full z-10 shadow-md bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Main Navbar Row */}
        <div className="flex items-center h-16 md:h-20 relative">
          {/* Left Side - Sidebar (moved more to the left) */}
          <div className="flex-none">
            <Sidebar />
          </div>
          
          {/* Logo - Only visible on mobile, positioned left */}
          <div className="flex-none ml-3 md:hidden">
            <a href="/home">
              <img
                className="h-10"
                loading="lazy"
                src={cat}
                alt="Marketplace logo"
              />
            </a>
          </div>
          
          {/* Spacer on mobile, Navigation on desktop */}
          <div className="flex-grow flex items-center">
            {/* Desktop Navigation - All menu items fit to the left side */}
            <nav className="hidden md:flex md:items-center gap-4 lg:gap-6">
              {["Figures", "Plushies", "Trading Cards", "Retro", "Goods"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm lg:text-base font-bold transition-colors duration-300 hover:text-gray-300"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Desktop Logo - Centered absolutely, only visible on desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <a href="/home">
              <img
                className="h-14"
                loading="lazy"
                src={cat}
                alt="Marketplace logo"
              />
            </a>
          </div>
          
          {/* Right Group - Search, Cart, Menu Toggle */}
          <div className="flex items-center">
            {/* Desktop Search - Only visible on desktop */}
            <div className="hidden md:block">
              <SearchForm />
            </div>
            
            {/* Cart Button - Always on the right */}
            <div className="flex-none ml-2">
              <Cart />
            </div>
            
            {/* Mobile Menu Button - Only visible on mobile */}
            <button 
              className="md:hidden flex-none ml-2 focus:outline-none p-1"
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Row - Separate row below navbar */}
        <div className="md:hidden py-2">
          <SearchForm />
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <nav className="flex flex-col">
              {["Figures", "Plushies", "Trading Cards", "Retro", "Goods"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="py-2 text-base font-bold transition-colors duration-300 hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;