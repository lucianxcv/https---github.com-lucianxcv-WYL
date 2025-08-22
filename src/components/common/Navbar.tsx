import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../utils/useAuth";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", href: "#home", icon: "🏠" },
    { id: "speakers", label: "Upcoming Speakers", href: "#upcoming", icon: "🎤" },
    { id: "past-shows", label: "Past Shows", href: "#past-shows", icon: "🎥" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/80 shadow-lg backdrop-blur-xl"
          : "bg-slate-900/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 text-slate-100 font-semibold text-lg hover:scale-105 transition-transform"
        >
          🛥️ <span className="hidden sm:inline">Wednesday Yachting Luncheon</span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.id} className="relative group">
              <a
                href={item.href}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                {item.icon} {item.label}
              </a>
              {/* Animated underline */}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <a className="px-3 py-1.5 text-sm border border-slate-500 rounded-md text-slate-200 hover:bg-slate-800 transition">
                  ⚙️ Admin
                </a>
              )}
              <button
                onClick={signOut}
                className="px-3 py-1.5 text-sm border border-slate-500 rounded-md text-slate-200 hover:bg-red-600 hover:border-red-600 transition"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <a
              href="#auth"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
            >
              🔐 Login
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-800/95 border-t border-slate-700 animate-slideDown">
            <ul className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-slate-200 hover:bg-slate-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon} {item.label}
                  </a>
                </li>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="w-full mt-3 px-4 py-2 border border-slate-500 rounded-md text-slate-200 hover:bg-red-600 hover:border-red-600 transition"
                >
                  🚪 Sign Out
                </button>
              ) : (
                <a
                  href="#auth"
                  className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md text-center shadow hover:scale-105 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔐 Login
                </a>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};
