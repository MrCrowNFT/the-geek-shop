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
        url: "/profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        title: "Security & Login",
        url: "/security",
        icon: <Settings className="w-4 h-4" />,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: <Bell className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Shopping",
    items: [
      {
        title: "Orders",
        url: "/orders",
        icon: <ShoppingCart className="w-4 h-4" />,
      },
      {
        title: "Wishlist",
        url: "/wishlist",
        icon: <Heart className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Payment & Shipping",
    items: [
      {
        title: "Payment Methods",
        url: "/payment",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        title: "Shipping Addresses",
        url: "/shipping",
        icon: <Truck className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        url: "/help",
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