import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUsers, FaChartPie, FaCalendarAlt, FaTachometerAlt, FaSignOutAlt, FaCrown, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/clients', label: 'Clients', icon: <FaUsers /> },
  { to: '/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
  { to: '/stats', label: 'Stats', icon: <FaChartPie /> },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen flex bg-offwhite dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy dark:bg-gray-800 text-white py-8 px-4 gap-4 shadow-lg">
        <div className="text-2xl font-bold mb-8 text-center">TaxTrack</div>
        
        {/* Admin Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-400 text-xl" />
            <div>
              <p className="text-sm text-blue-100">Welcome back,</p>
              <p className="font-semibold text-white">{user?.name || 'Admin'}</p>
            </div>
          </div>
        </div>
        
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-semibold hover:bg-blue/80 hover:scale-105 ${
              location.pathname.startsWith(link.to) ? 'bg-blue/90 shadow-lg' : ''
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 rounded-lg mt-auto bg-accentred hover:bg-red-700 transition-all duration-200 font-semibold hover:scale-105"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Topbar for mobile */}
        <nav className="flex items-center justify-between w-full bg-navy dark:bg-gray-800 text-white px-4 py-3 shadow-lg sticky top-0 z-30">
          <div className="text-xl font-bold">TaxTrack</div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <DarkModeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-blue/20 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute right-0 top-0 h-full w-80 bg-navy dark:bg-gray-800 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xl font-bold text-white">Menu</div>
                    <button 
                      onClick={closeMobileMenu}
                      className="p-2 hover:bg-blue/20 rounded-lg transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  {/* Admin Banner */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <FaCrown className="text-yellow-400 text-xl" />
                      <div>
                        <p className="text-sm text-blue-100">Welcome back,</p>
                        <p className="font-semibold text-white">{user?.name || 'Admin'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-semibold hover:bg-blue/80 ${
                          location.pathname.startsWith(link.to) ? 'bg-blue/90 shadow-lg' : ''
                        }`}
                      >
                        {link.icon} {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg mt-8 w-full bg-accentred hover:bg-red-700 transition-all duration-200 font-semibold"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-500 text-xl" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Here's what's happening with your business today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <DarkModeToggle />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-500 text-lg" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Here's what's happening with your business today
              </p>
            </div>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
} 