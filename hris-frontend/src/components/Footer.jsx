import React from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Fitur', href: '/#features' },
    { name: 'Tentang', href: '/#about' },
    { name: 'Kontak', href: '/#contact' },
    { name: 'Harga', href: '#' },
    { name: 'Dokumentasi', href: '#' }
  ];

  const resources = [
    { name: 'Blog', href: '#' },
    { name: 'Pusat Bantuan', href: '#' },
    { name: 'Dokumentasi API', href: '#' },
    { name: 'Komunitas', href: '#' },
    { name: 'Dukungan', href: '#' },
    { name: 'Status', href: '#' }
  ];

  const legal = [
    { name: 'Kebijakan Privasi', href: '#' },
    { name: 'Syarat Layanan', href: '#' },
    { name: 'Keamanan', href: '#' },
    { name: 'Kepatuhan', href: '#' }
  ];

  const handleQuickLinkClick = (e, href) => {
    e.preventDefault();
    const sectionId = href.startsWith('/#') ? href.split('#')[1] : null;

    if (sectionId) {
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = `#${sectionId}`;
        }
      } else {
        // Navigate to home via Router, then scroll programatically
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">OS</span>
              </div>
              <span className="text-xl font-bold">Outsourcing Pro</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Mitra strategis dalam penyediaan tenaga kerja berkualitas dan solusi manajemen SDM yang efisien untuk mendukung pertumbuhan bisnis Anda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <EnvelopeIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <PhoneIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <BuildingOfficeIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.slice(0, 6).map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      onClick={(e) => handleQuickLinkClick(e, link.href)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sumber Daya</h3>
            <ul className="space-y-3">
              {resources.slice(0, 6).map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {legal.slice(0, 4).map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Outsourcing Pro. Hak cipta dilindungi.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live Status
            </span>
            <span>Dipercaya oleh 500+ perusahaan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;