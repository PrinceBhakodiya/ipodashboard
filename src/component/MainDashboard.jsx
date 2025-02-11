import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const MainDashboard = () => {
  const [ipoData, setIpoData] = useState({
    ipoList: [],
    loading: true,
    error: null
  });

  const [smeData, setSmeData] = useState({
    smeList: [],
    loading: true,
    error: null
  });

  // Fetch IPO data
  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        const response = await axios.get('https://ipo-6thl.onrender.com/api/ipo?status=all');
        setIpoData({
          ipoList: response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        setIpoData({
          ipoList: [],
          loading: false,
          error: 'Failed to fetch IPO data'
        });
      }
    };

    fetchIPOs();
  }, []);

  // Fetch SME data
  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const response = await axios.get('/api/smes');
        setSmeData({
          smeList: response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        setSmeData({
          smeList: [],
          loading: false,
          error: 'Failed to fetch SME data'
        });
      }
    };

    fetchSMEs();
  }, []);

  // Calculate totals
  const totalIPOs = ipoData.ipoList.length;
  const totalSMEs = smeData.smeList.length;
  const upcomingIPOs = ipoData.ipoList.filter(ipo => ipo.ipoStatus === 'upcoming').length;
  const activeIPOs = ipoData.ipoList.filter(ipo => ipo.ipoStatus === 'live').length;
  const listedIPOs = ipoData.ipoList.filter(ipo => ipo.ipoStatus === 'listed').length;

  // Loading component
  const LoadingCard = () => (
    <div className="bg-gray-200 p-4 rounded-lg shadow-lg animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/4"></div>
    </div>
  );

  // Error component
  const ErrorCard = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
      <p>{message}</p>
    </div>
  );

  if (ipoData.loading || smeData.loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(5)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ipoData.error || smeData.error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard Overview</h1>
          <ErrorCard message={ipoData.error || smeData.error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-semibold text-white">Total IPOs</h2>
            <p className="text-3xl font-bold text-white">{totalIPOs}</p>
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
      </div>
    </div>
  );
};

export default MainDashboard;