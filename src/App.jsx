import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Attendance from './pages/Attendance';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [isAuthenticated, userId]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />} />
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/attendance" /> : <Navigate to="/login" />
        } />
        {/* <Route path="/" element={
          isAuthenticated ? <Navigate to="/attendance" /> : <Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />
        } /> */}
        <Route path="/attendance" element={
          isAuthenticated ? <Attendance userId={userId} /> : <Navigate to="/" />
        } />            
      </Routes>
    </Router>
  );
}

export default App;
