import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Menu, X, LogOut, User, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'My Documents', path: '/documents' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-3 sm:pt-4">
      <nav className="max-w-[1440px] mx-auto h-16 sm:h-[68px] rounded-2xl bg-[#FFF8ED]/85 backdrop-blur-xl border border-[#6B315E]/15 shadow-[0_8px_30px_rgba(36,22,47,0.06)] px-4 sm:px-6 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B315E] to-[#24162F] text-[#FFF8ED] flex items-center justify-center shadow-md shadow-[#6B315E]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#A8D5C2]" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base sm:text-lg text-[#24162F] tracking-tight block leading-tight">
              DocuClean<span className="text-[#3C8D87] ml-0.5">AI</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#6F6670] font-semibold block">
              Document Optical Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#EADCC8]/40 p-1 rounded-xl border border-[#6B315E]/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-[#FFF8ED] text-[#6B315E] shadow-xs'
                  : 'text-[#6F6670] hover:text-[#2C2830]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button & User Profile */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/upload"
            className="primary-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-[#A8D5C2]" />
            <span>Clean Document</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#EADCC8]">
              <div className="w-8 h-8 rounded-full bg-[#EADCC8] text-[#6B315E] flex items-center justify-center text-xs font-bold font-mono">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-[#2C2830] block leading-tight truncate max-w-[110px]">
                  {user?.name}
                </span>
                <span className="text-[10px] text-[#978D91] block leading-tight">Account</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-[#6F6670] hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="secondary-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#6B315E]" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/upload"
            className="primary-btn px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Clean</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#2C2830] hover:bg-[#EADCC8]/60 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                isActive(link.path)
                  ? 'bg-[#6B315E]/10 text-[#6B315E]'
                  : 'text-[#6F6670] hover:bg-[#EADCC8]/40'
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="pt-3 mt-1 border-t border-[#EADCC8] flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#EADCC8] text-[#6B315E] flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#2C2830]">{user?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-bold flex items-center gap-1 p-1 hover:underline cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="secondary-btn w-full py-2.5 rounded-xl text-xs font-bold text-center"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
