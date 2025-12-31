import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Contact from './components/Contact';
// import Employees from './components/Employees';
import Departments from './components/Departments';
import Positions from './components/Positions';
import JobPostings from './components/JobPostings';
import Attendance from './components/Attendance';
import AttendanceLogin from './components/AttendanceLogin';

const ScrollAwareLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll programmatically when navigated to home with state.scrollTo
  useEffect(() => {
    if (location.pathname === '/' && location.state && location.state.scrollTo) {
      const id = location.state.scrollTo;
      // Ensure sections are mounted before scrolling
      setTimeout(() => {
        // Update hash for consistency/active state
        window.location.hash = `#${id}`;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear navigation state to avoid repeated scroll on re-renders
        navigate(location.pathname, { replace: true, state: {} });
      }, 0);
    }
  }, [location, navigate]);

  return (
    <>
      <Header isScrolled={isScrolled} />
      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <About />
                <Contact />
              </>
            }
          />
          <Route path="/attendance-login" element={<AttendanceLogin />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/job-postings" element={<JobPostings />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollAwareLayout />
    </Router>
  );
}

export default App;