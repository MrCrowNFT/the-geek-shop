import { useEffect } from "react";
import { useThemeStore } from "@/hooks/use-theme";

const Layout = ({ children }) => {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <div>{children}</div>;
};

export default Layout;
