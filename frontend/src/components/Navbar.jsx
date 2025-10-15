import React, { useState } from "react";
import { Menu, X, Brain, LogIn, User as UserIcon } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Navbar
 * - Translucent top bar with backdrop blur for a premium feel
 * - Desktop links + Auth area on the right
 * - Mobile menu slides down with large tap targets
 * - Avatar with initials when authenticated
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);

  // Compute initials safely
  const initials =
    (user?.name || "")
      .split(" ")
      .slice(0, 2)
      .map((s) => s?.[0]?.toUpperCase())
      .join("") || "U";

  const isAuthed = Boolean(user?.isAuthenticated);

  const UserAvatar = () => (
    <div
      title={user?.name || "User"}
      className="h-8 w-8 rounded-lg bg-indigo-500/80 text-white grid place-items-center ring-1 ring-white/10"
    >
      <span className="text-xs font-semibold">{initials}</span>
    </div>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-3">
      {!isAuthed ? (
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-white shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </Link>
      ) : (
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Go to dashboard"
        >
          <UserAvatar />
          <span className="hidden lg:inline text-sm text-slate-200 group-hover:text-white">
            {user?.name || "Dashboard"}
          </span>
        </Link>
      )}
    </div>
  );

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "text-slate-200 hover:text-white",
          isActive ? "bg-white/10" : "hover:bg-white/5",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
        ].join(" ")
      }
      onClick={() => setIsOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Background bar with glass effect */}
      <div className="backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 bg-slate-900/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row */}
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-1"
              >
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-indigo-500/20 ring-1 ring-white/10">
                  <Brain className="h-5 w-5 text-indigo-300" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  InterviAI
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavItem to="#features">Features</NavItem>
              <NavItem to="#how-it-works">How it Works</NavItem>
              <NavItem to="#pricing">Pricing</NavItem>
              <NavItem to="#about">About</NavItem>
              <AuthButtons />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen((s) => !s)}
                className="text-slate-200 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/70">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              <NavItem to="#features">Features</NavItem>
              <NavItem to="#how-it-works">How it Works</NavItem>
              <NavItem to="#pricing">Pricing</NavItem>
              <NavItem to="#about">About</NavItem>

              <div className="pt-3 border-t border-white/10">
                {!isAuthed ? (
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-3 py-2 rounded-md text-slate-200 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    to="/dashboard" // fixed typo from "/dasboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <UserAvatar />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 -mt-0.5">Dashboard</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
