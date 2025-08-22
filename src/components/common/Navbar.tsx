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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/90 shadow-md backdrop-blur-md"
          : "bg-slate-900/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 text-slate-100 font-semibold text-lg hover:scale-105 transition"
        >
          🛥️ <span>Wednesday Yachting Luncheon</span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:underline underline-offset-4 transition"
              >
                {item.icon} {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <a
                  href="#admin"
                  className="px-3 py-1 text-sm border border-slate-500 rounded-md text-slate-200 hover:bg-slate-700 transition"
                >
                  ⚙️ Admin
                </a>
              )}
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm border border-slate-500 rounded-md text-slate-200 hover:bg-red-600 hover:border-red-600 transition"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <a
              href="#auth"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
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
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <ul className="flex flex-col p-4 gap-3">
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
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-500 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔐 Login
              </a>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
