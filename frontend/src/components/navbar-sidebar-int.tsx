import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import {
  User,
  ShoppingCart,
  Heart,
  Truck,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

// User sidebar data
const userData = {
  navMain: [
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/account/profile",
          icon: <User className="w-4 h-4 mr-2" />,
          isActive: true,
        },
        {
          title: "Security & Login",
          url: "/account/security",
          icon: <Settings className="w-4 h-4 mr-2" />,
        },
        {
          title: "Notifications",
          url: "/account/notifications",
          icon: <Bell className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      title: "Shopping",
      items: [
        {
          title: "Orders",
          url: "/account/orders",
          icon: <ShoppingCart className="w-4 h-4 mr-2" />,
        },
        {
          title: "Wishlist",
          url: "/account/wishlist",
          icon: <Heart className="w-4 h-4 mr-2" />,
        },
        {
          title: "Reviews",
          url: "/account/reviews",
          icon: <User className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      title: "Payment & Shipping",
      items: [
        {
          title: "Payment Methods",
          url: "/account/payment",
          icon: <CreditCard className="w-4 h-4 mr-2" />,
        },
        {
          title: "Shipping Addresses",
          url: "/account/shipping",
          icon: <Truck className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Help Center",
          url: "/account/help",
          icon: <HelpCircle className="w-4 h-4 mr-2" />,
        },
        {
          title: "Contact Support",
          url: "/account/support",
          icon: <HelpCircle className="w-4 h-4 mr-2" />,
        },
        {
          title: "Log Out",
          url: "/logout",
          icon: <LogOut className="w-4 h-4 mr-2" />,
        },
      ],
    },
  ],
};

// Custom sidebar that doesn't rely on context
const CustomSidebar: React.FC = () => {
  return (
    <div className="h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Account</h2>
      </div>
      
      {/* Content */}
      <div className="py-2">
        {userData.navMain.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
              {group.title}
            </h3>
            <ul>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a
                    href={item.url}
                    className={`flex items-center px-4 py-2 text-sm ${
                      item.isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const NavbarSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar onSidebarToggle={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={`fixed top-16 md:top-20 left-0 bottom-0 w-64 z-30 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <CustomSidebar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavbarSidebar;