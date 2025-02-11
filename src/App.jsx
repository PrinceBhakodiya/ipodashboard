import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './component/Login.jsx';
// import Home from './component/Home';
import Dashboard from './component/dashboard.jsx';
// Add new imports for IPO components
import ViewIPO from './component/viewIPO.jsx';
import AddIPO from './component/AddIPO.jsx';
import UpdateIPO from './component/UpdateIPO.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check localStorage for aut   hentication status on initial load
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Store authentication status
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated'); // Remove authentication status
    };

    useEffect(() => {
        // Optional: Add a cleanup function to handle logout on unmount
        return () => {
            // Perform any necessary cleanup
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
                <Route path="/home" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
                {/* Add new IPO routes with authentication protection */}
                <Route 
                    path="/ipo/view" 
                    element={isAuthenticated ? <ViewIPO /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/ipo/add" 
                    element={isAuthenticated ? <AddIPO /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/ipo/update/:id" 
                    element={isAuthenticated ? <UpdateIPO /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
}

export default App;