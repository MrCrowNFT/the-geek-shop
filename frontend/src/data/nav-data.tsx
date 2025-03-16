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
  
export const navData = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/account/profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        title: "Security & Login",
        url: "/account/security",
        icon: <Settings className="w-4 h-4" />,
      },
      {
        title: "Notifications",
        url: "/account/notifications",
        icon: <Bell className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Shopping",
    items: [
      {
        title: "Orders",
        url: "/account/orders",
        icon: <ShoppingCart className="w-4 h-4" />,
      },
      {
        title: "Wishlist",
        url: "/account/wishlist",
        icon: <Heart className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Payment & Shipping",
    items: [
      {
        title: "Payment Methods",
        url: "/account/payment",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        title: "Shipping Addresses",
        url: "/account/shipping",
        icon: <Truck className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        url: "/account/help",
        icon: <HelpCircle className="w-4 h-4" />,
      },
      {
        title: "Log Out",
        url: "/logout",
        icon: <LogOut className="w-4 h-4" />,
      },
    ],
  },
];