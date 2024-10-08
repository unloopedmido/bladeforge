import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-center text-5xl font-bold">Settings</h1>
      <p className="mb-8 text-center font-light text-foreground/70">
        This page is under construction, please come back later
      </p>

      <div className="p-6">
        <h2 className="mb-4 text-3xl font-semibold">Preferences</h2>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl">Toggle Theme</h3>
          <Button onClick={toggleTheme}>
            {theme === "light" ? "Switch to Dark" : "Switch to Light"}
          </Button>
        </div>
      </div>
    </div>
  );
}
