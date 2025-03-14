import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage and system preference
    if (typeof localStorage !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode !== null) return savedMode === "true";
    }
    // Fall back to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("darkMode", darkMode.toString());

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggle = (checked: boolean) => {
    setDarkMode(checked);
  };

  return (
    <Switch
      checked={darkMode}
      onCheckedChange={handleToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
};

export default DarkModeToggle;
