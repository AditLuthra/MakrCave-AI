import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, Grid3X3 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export function EnhancedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Makerspaces", href: "/makerspaces" },
    { name: "Store", href: "/store" },
    { name: "Service Providers", href: "/service-providers" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Support", href: "/support" },
    { name: "About", href: "/about" },
  ];

  const launcherApps = [
    {
      name: "MakrCave",
      description: "Makerspace Management",
      url: "https://makrcave.com",
      bgColor: "bg-makr-blue/10 dark:bg-makr-blue/20",
      iconColor: "bg-makr-blue",
    },
    {
      name: "MakrX.events",
      description: "Event Management",
      url: "https://events.makrx.org",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "bg-orange-500",
    },
    {
      name: "MakrX.Store",
      description: "Tools & Components",
      url: "https://makrx.store",
      bgColor: "bg-terminal-green/10 dark:bg-terminal-green/20",
      iconColor: "bg-terminal-green",
    },
    {
      name: "3D.MakrX.Store",
      description: "Custom Fabrication",
      url: "https://3d.makrx.store",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "bg-purple-500",
    },
    {
      name: "Provider Panel",
      description: "Service Providers",
      url: "https://providers.makrx.org",
      bgColor: "bg-makr-yellow/10 dark:bg-makr-yellow/20",
      iconColor: "bg-makr-yellow",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg-primary/95 backdrop-blur-md border-b border-makr-blue/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-makr-blue rounded-lg flex items-center justify-center shadow-neon transition-all group-hover:shadow-neon-lg">
              <span className="text-white font-bold text-sm font-mono">M</span>
            </div>
            <span className="text-xl font-bold text-dark-text-primary font-mono transition-colors group-hover:text-makr-blue">
              Makr<span className="text-makr-yellow">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold font-mono transition-all ${
                  isActive(item.href)
                    ? "text-makr-yellow shadow-neon-yellow"
                    : "text-dark-text-primary hover:text-makr-blue hover:shadow-neon"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Universal Launcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLauncher(!showLauncher)}
                className="p-2 rounded-lg hover:bg-makr-blue/10 hover:shadow-neon transition-all"
                aria-label="Launch Apps"
              >
                <Grid3X3 className="w-5 h-5 text-makr-blue" />
              </Button>

              {/* Launcher Dropdown */}
              {showLauncher && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-dark-surface/95 backdrop-blur-sm rounded-xl border border-makr-blue/30 p-4 z-50 shadow-neon-lg">
                  <h3 className="font-semibold font-mono text-gradient-cyberpunk mb-3">
                    MakrX Apps
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {launcherApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg border border-dark-border hover:border-makr-blue/50 hover:shadow-neon transition-all group card-cyberpunk"
                      >
                        <div
                          className={`w-8 h-8 ${app.bgColor} rounded-lg flex items-center justify-center mb-2 transition-all group-hover:shadow-neon`}
                        >
                          <div
                            className={`w-4 h-4 ${app.iconColor} rounded transition-all`}
                          ></div>
                        </div>
                        <div className="text-sm font-medium font-mono text-dark-text-primary group-hover:text-makr-blue transition-colors">
                          {app.name}
                        </div>
                        <div className="text-xs text-dark-text-muted font-mono">
                          {app.description}
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-dark-border">
                    <Link
                      to="/docs"
                      className="text-sm text-makr-blue hover:text-makr-yellow transition-colors font-mono"
                      onClick={() => setShowLauncher(false)}
                    >
                      View Documentation →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-makr-blue/10 hover:shadow-neon transition-all"
              aria-label="Toggle theme"
            >
              <span className="text-makr-yellow font-mono text-xs">
                {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
              </span>
            </Button>

            {/* Sign In Button */}
            <a
              href="https://auth.makrx.org/login"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyberpunk px-4 py-2 text-sm font-mono font-semibold"
            >
              Sign In
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-makr-blue/10 transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-makr-blue" />
            ) : (
              <Menu className="w-5 h-5 text-makr-blue" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-makr-blue/30 backdrop-blur-sm">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-semibold font-mono transition-all ${
                    isActive(item.href)
                      ? "text-makr-yellow"
                      : "text-dark-text-primary hover:text-makr-blue"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Launcher */}
              <div className="pt-4 border-t border-dark-border">
                <div className="text-sm font-medium font-mono text-gradient-cyberpunk mb-3">
                  MakrX Apps
                </div>
                <div className="space-y-2">
                  {launcherApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-makr-blue/10 transition-all"
                    >
                      <div
                        className={`w-6 h-6 ${app.bgColor} rounded flex items-center justify-center`}
                      >
                        <div
                          className={`w-3 h-3 ${app.iconColor} rounded`}
                        ></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium font-mono text-dark-text-primary">
                          {app.name}
                        </div>
                        <div className="text-xs text-dark-text-muted font-mono">
                          {app.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-makr-blue ml-auto" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Theme Toggle & Sign In */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-mono text-dark-text-primary">
                    Theme
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="text-makr-yellow font-mono"
                  >
                    {theme === "dark" ? "🌙 Dark" : theme === "light" ? "☀️ Light" : "🖥️ System"}
                  </Button>
                </div>
                <a
                  href="https://auth.makrx.org/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full btn-cyberpunk text-center py-2 font-mono font-semibold"
                >
                  Sign In
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for launcher */}
      {showLauncher && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLauncher(false)}
        />
      )}
    </header>
  );
}