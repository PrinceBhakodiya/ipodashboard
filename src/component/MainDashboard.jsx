import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

const MainDashboard = () => {
  const [ipoList, setIpoList] = useState([
    {
      name: 'Tech Innovations Inc.',
      status: 'Upcoming',
    },
    {
      name: 'Green Energy Solutions',
      status: 'Active',
    },
    {
      name: 'HealthTech Innovations',
      status: 'Listed',
    },
  ]);

  const [smeList, setSmeList] = useState([
    {
      name: 'Tech Solutions Ltd.',
    },
    {
      name: 'Green Energy Corp.',
    },
  ]);

  // Calculate totals
  const totalIPOs = ipoList.length;
  const totalSMEs = smeList.length;
  const upcomingIPOs = ipoList.filter(ipo => ipo.status === 'Upcoming').length;
  const activeIPOs = ipoList.filter(ipo => ipo.status === 'Active').length;
  const listedIPOs = ipoList.filter(ipo => ipo.status === 'Listed').length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Total IPOs</h2>
            <p className="text-3xl font-bold text-white">{totalIPOs}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Total SMEs</h2>
            <p className="text-3xl font-bold text-white">{totalSMEs}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Upcoming IPOs</h2>
            <p className="text-3xl font-bold text-white">{upcomingIPOs}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Active IPOs</h2>
            <p className="text-3xl font-bold text-white">{activeIPOs}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Listed IPOs</h2>
            <p className="text-3xl font-bold text-white">{listedIPOs}</p>
          </div>
        </div>
        <div className="mt-6">
          {/* <Link to="/addIPO" className="bg-blue-500 text-white rounded-lg py-2 px-4 mr-2 hover:bg-blue-600 transition duration-300">Add IPO</Link>
          <Link to="/viewIPO" className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 transition duration-300">View IPOs</Link>
          <Link to="/addSME" className="bg-blue-500 text-white rounded-lg py-2 px-4 mr-2 hover:bg-blue-600 transition duration-300">Add SME</Link>
          <Link to="/viewSME" className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 transition duration-300">View SMEs</Link> */}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard; 