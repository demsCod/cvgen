import React from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Home/Dashboard';
import EditResume from './pages/ResumeUpdate/EditResume';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import AuthModal from './components/auth/AuthModal';

// Wrapper to handle modal routes with background location pattern
function ModalSwitch(){
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:resumeId" element={<EditResume />} />
      </Routes>
      {backgroundLocation && location.pathname === '/login' && (
        <AuthModal mode="login" />
      )}
      {backgroundLocation && location.pathname === '/signup' && (
        <AuthModal mode="signup" />
      )}
    </>
  );
}

const App = () => {
  return (
    <Router>
      <ModalSwitch />
    </Router>
  );
}

export default App;