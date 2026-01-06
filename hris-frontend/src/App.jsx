import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
import Documents from './components/Documents';
import Shifts from './components/Shifts';
import Roster from './components/Roster';
import HRDocuments from './components/HRDocuments';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/attendance-login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

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
          <Route path="/job-postings" element={<RequireAuth><JobPostings /></RequireAuth>} />
          <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
          <Route path="/documents" element={<RequireAuth><Documents /></RequireAuth>} />
          <Route path="/shifts" element={<RequireAuth><Shifts /></RequireAuth>} />
          <Route path="/roster" element={<RequireAuth><Roster /></RequireAuth>} />
          <Route path="/hr-documents" element={<RequireAuth><HRDocuments /></RequireAuth>} />
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
