import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
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
      url: "#",
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
      url: "#",
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
      url: "#",
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
      url: "#",
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

interface UserSidebarProps {
  className?: string;
}

export function UserSidebar({ className }: UserSidebarProps) {
  return (
    <Sidebar className={`h-full bg-white dark:bg-gray-800 shadow-lg ${className}`}>
      <SidebarHeader>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Account</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        {userData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={subItem.isActive}>
                      <a 
                        href={subItem.url} 
                        className={`flex items-center px-4 py-2 text-sm ${
                          subItem.isActive 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {subItem.icon}
                        {subItem.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}