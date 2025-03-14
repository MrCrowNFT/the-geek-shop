import React, { useState } from "react";
import { SearchForm } from "./search-form";
import cat from "../assets/cat-logo.svg";
import DarkModeToggle from "./dark-mode-toggle";
import { Menu } from "lucide-react";

interface NavbarProps {
  className?: string;
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ className, onSidebarToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`sticky top-0 w-full bg-[#191970] dark:bg-gray-900 text-white font-sans z-10 shadow-md transition-colors duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[5%]">
        <div className="flex items-center h-16 md:h-20">
          {/* Sidebar Menu Button - Far left */}
          <div className="mr-6">
            <button
              onClick={onSidebarToggle}
              className="p-2 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo - Centered */}
          <div className="flex-1 flex justify-center">
            <a href="/home" className="block">
              <img
                className="h-10 md:h-14"
                loading="lazy"
                src={cat}
                alt="Marketplace logo"
              />
            </a>
          </div>

          {/* Navigation Menu - Right of Logo */}
          <div className="hidden md:flex items-center ml-auto mr-4">
            <ul className="flex items-center space-x-4 lg:space-x-6">
              {["Figures", "Plushies", "Trading Cards", "Retro", "Goods"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm lg:text-base font-bold transition-colors duration-300 hover:text-gray-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Search Form - Right side */}
          <div className="flex items-center">
            <SearchForm />
          </div>

          {/* Dark Mode Toggle - Far right */}
          <div className="ml-4">
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            className="ml-4 md:hidden focus:outline-none"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu - Conditional rendering based on state */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col space-y-3">
              {["Figures", "Plushies", "Trading Cards", "Retro", "Goods"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-lg font-bold transition-colors duration-300 hover:text-gray-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;