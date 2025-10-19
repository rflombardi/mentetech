import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="transition-all duration-300"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-300 hover:bg-primary/10 hover:border-primary/50"
      aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </Button>
  );
}
