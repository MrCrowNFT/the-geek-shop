import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  User,
  PlusCircle,
  Heart,
} from "lucide-react";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={`flex flex-col md:flex-row justify-between items-center bg-white text-black px-4 py-3 ${className}`}
    >
      <div className="social-media flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-start md:ml-[10%] mb-4 md:mb-0">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
          aria-label="Twitter"
        >
          <Twitter size={20} />
        </a>

        <span className="hidden md:inline-block h-6 w-px bg-gray-400"></span>
        <a
          href="mailto:marketplace@gmail.com"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
        >
          <Mail size={20} />
          <span className="hidden sm:inline-block">thegeekshop@gmail.com</span>
        </a>
      </div>

      <div className="user-interactions flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-start md:mr-[10%]">
        <a
          href="/login"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
        >
          <User size={20} />
          <p className="hidden sm:block">Login</p>
        </a>
        <span className="inline-block h-6 w-px bg-gray-400"></span>
        <a
          href="/signup/"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
        >
          <PlusCircle size={20} />
          <p className="hidden sm:block">Create Account</p>
        </a>
        <span className="inline-block h-6 w-px bg-gray-400"></span>
        <Link
          to="/wishlist"
          className="flex items-center gap-2 hover:text-red-500 transition-colors"
          aria-label="Favorites"
        >
          <Heart size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
