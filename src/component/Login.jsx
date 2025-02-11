import React, { useState } from 'react';
import './Login.css'; // Import custom CSS for the wave background

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false); // New state for authentication
  const [access, setAccess] = useState(null); // New state for access token

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin') {
      setAuthenticated(true); // Set authenticated to true
      setAccess('your_access_token_here'); // Set access token or similar
      console.log('Logging in with:', { username, password });
      onLogin(); // Call onLogin to update authentication state
    } else {
      console.log('Username does not match.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden  bg-gray-100">
      <div className="absolute inset-0 wave-background"></div>
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg transition-transform w-150 h-100 transform hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">IPOGURU</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-b-2 border-blue-500 focus:border-blue-700 focus:outline-none w-full py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-blue-500 focus:border-blue-700 focus:outline-none w-full py-2"
              required
            />
          </div>
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 