import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, XCircle } from "lucide-react";
import DarkModeToggle from "./dark-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { navData } from "@/data/nav-data";
import { useLogout } from "@/hooks/use-auth";

interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const logout = useLogout(); // Initialize the logout hook
  const navigate = useNavigate(); // For redirecting after logout

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Handle logout action
  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    itemUrl: string
  ) => {
    // Check if this is the logout item
    if (itemUrl === "/logout") {
      e.preventDefault(); // Prevent default navigation
      try {
        await logout.mutateAsync();
        // Close sidebar after successful logout
        setIsOpen(false);
        // Redirect to login page or homepage after logout
        navigate("/login");
      } catch (error) {
        console.error("Failed to logout:", error);
        // You could show an error toast/notification here
      }
    }
  };

  return (
    <>
      <div className="relative">
        <motion.button
          type="button"
          className="relative flex items-center justify-center p-2 rounded-md shadow-md"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 z-50 h-full w-72 shadow-lg overflow-y-auto bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Menu</h2>
              <motion.button
                onClick={toggleSidebar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <XCircle className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 border-b">
              <p className="text-sm font-semibold text-gray-600 uppercase">
                Dark mode
              </p>
              <DarkModeToggle />
            </div>
            <div className="p-4">
              {navData.map((section) => (
                <div key={section.title} className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    {section.title}
                  </p>
                  <div className="space-y-2">
                    {section.items.map((item: NavItem) => (
                      <a
                        key={item.title}
                        href={item.url}
                        onClick={(e) => handleLogout(e, item.url)}
                        className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                          item.url === "/logout" && logout.isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {item.icon}{" "}
                        <span>
                          {item.title}
                          {item.url === "/logout" &&
                            logout.isLoading &&
                            " (Logging out...)"}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link to={"/home"}>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>{}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-xs text-gray-500">user@example.com</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
