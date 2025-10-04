import React from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Home/Dashboard';
import EditResume from './pages/ResumeUpdate/EditResume';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
const App = () => {
  return (
    <>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume/:resumeId" element={<EditResume />} />
        </Routes>
      </Router>
    </div>
    </>
  );
}

export default App;