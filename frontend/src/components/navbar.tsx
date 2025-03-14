import React from "react";
import { SearchForm } from "./search-form";
import cat from "../assets/cat-logo.svg";
import Cart from "./cart";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <div className={`sticky top-0 w-full bg-[#191970] text-white font-sans z-10 shadow-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[3%]">
        <div className="flex justify-between items-center h-16 md:h-20 relative">
          {/* Left Side - Navigation Menu */}
          <nav className="flex md:flex flex-1 justify-start gap-4 lg:gap-6">
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

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center w-24 md:w-32">
            <a href="/home">
              <img
                className="h-10 md:h-14 invert" // makes the SVG white
                loading="lazy"
                src={cat}
                alt="Marketplace logo"
              />
            </a>
          </div>

          {/* Right Side - Search & Cart */}
          <div className="flex flex-1 justify-end items-center gap-4">
            <SearchForm />
            <Cart />
          </div>
        </div>

        {/* Mobile Navigation Button */}
        <button className="md:hidden focus:outline-none absolute top-5 right-4" aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;