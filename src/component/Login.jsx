import React, { useState, useEffect } from 'react';
import './Login.css'; // We'll define custom animations and wave effect here

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Handle keydown events for detecting CAPS LOCK
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (username === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        onLogin();
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFocus = (field) => {
    setFocusedField(field);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated wave background */}
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>
      </div>
      
      {/* Floating particles */}
      <div className="particle-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i+1}`}></div>
        ))}
      </div>
      
      {/* Login card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 transform transition-all duration-500 hover:shadow-2xl">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="logo-animation mb-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              IPOHUB
            </h1>
            <div className="logo-underline"></div>
          </div>
          <p className="text-gray-600">Access your dashboard</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div className={`input-group relative transition-all duration-300 ${focusedField === 'username' ? 'focused' : ''}`}>
            <label 
              className={`absolute left-2 transition-all duration-300 ${
                username || focusedField === 'username' 
                  ? '-top-6 text-xs font-medium text-blue-600' 
                  : 'top-2 text-gray-500'
              }`}
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => handleFocus('username')}
                onBlur={handleBlur}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent outline-none transition-all duration-300"
                required
              />
              <span className={`input-line absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                focusedField === 'username' ? 'w-full' : ''
              }`}></span>
            </div>
          </div>
          
          {/* Password field */}
          <div className={`input-group relative transition-all duration-300 ${focusedField === 'password' ? 'focused' : ''}`}>
            <label 
              className={`absolute left-2 transition-all duration-300 ${
                password || focusedField === 'password' 
                  ? '-top-6 text-xs font-medium text-blue-600' 
                  : 'top-2 text-gray-500'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent outline-none pr-10 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
              <span className={`input-line absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                focusedField === 'password' ? 'w-full' : ''
              }`}></span>
            </div>
            
            {/* Show capslock warning */}
            {capsLockOn && (
              <div className="text-amber-500 text-xs mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                CAPS LOCK is on
              </div>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md border border-red-100 animate-shake">
              {error}
            </div>
          )}
          
          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                Login
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        </form>
        
        {/* Additional options */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;