import React from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const navItems = isLoggedIn
    ? [
        { name: 'Beranda', path: '/' },
        { name: 'Fitur', path: '/#features' },
        { name: 'Tentang', path: '/#about' },
        { name: 'Kontak', path: '/#contact' },
        { name: 'Lowongan', path: '/job-postings' },
        { name: 'Absensi', path: '/attendance' },
      ]
    : [
        { name: 'Beranda', path: '/' },
        { name: 'Fitur', path: '/#features' },
        { name: 'Tentang', path: '/#about' },
        { name: 'Kontak', path: '/#contact' },
        { name: 'Lowongan', path: '/job-postings' },
      ];

  const handleNavClick = (e, item) => {
    // Handle hash navigation for homepage sections using Router
    if (item.path.includes('#')) {
      e.preventDefault();
      setIsMenuOpen(false);
      const sectionId = item.path.split('#')[1];
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = `#${sectionId}`;
        }
      } else {
        // Navigate via Router without full reload, then scroll programmatically
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employee_id');
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (item) => {
    if (item.path.includes('#')) {
      const hash = item.path.substring(item.path.indexOf('#'));
      return location.pathname === '/' && location.hash === hash;
    }
    return location.pathname === item.path;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">HRIS Perusahaan</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-gray-700 hover:text-blue-900 font-medium transition-colors duration-200 ${isActive(item) ? 'text-blue-900 font-semibold' : ''}`}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Keluar
              </button>
            ) : (
              <Link
                to="/attendance-login"
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-900" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-gray-700 hover:text-blue-900 font-medium py-2 ${isActive(item) ? 'text-blue-900 font-semibold' : ''}`}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <button
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-center"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Keluar
                </button>
              ) : (
                <Link
                  to="/attendance-login"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium text-center"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;