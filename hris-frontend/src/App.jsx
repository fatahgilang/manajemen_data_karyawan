import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Positions from './components/Positions';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header isScrolled={isScrolled} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
                <About />
                <Contact />
              </>
            } />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/positions" element={<Positions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;