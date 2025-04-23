import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowUp, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Defined types for better code clarity
/**
 * @typedef {Object} IPO
 * @property {string} id - Unique identifier for the IPO
 * @property {string} companyName - Name of the company
 * @property {string} ipoStatus - Status of the IPO (upcoming, live, listed)
 * @property {string} openDate - Opening date of the IPO
 * @property {string} closeDate - Closing date of the IPO
 * @property {number} issuePrice - Price per share
 */

/**
 * @typedef {Object} SME
 * @property {string} id - Unique identifier for the SME
 * @property {string} companyName - Name of the SME company
 */

/**
 * @typedef {Object} DataState
 * @property {Array} dataList - List of data items
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 */

const MainDashboard = () => {
  // State management with proper typing
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
  const activeIPOs = ipoData.ipoList.filter(
    ipo => ['live', 'allotment out'].includes(ipo.ipoStatus)
  ).length;
    const listedIPOs = ipoData.ipoList.filter(ipo => ipo.ipoStatus === 'listed').length;

// Date formatter function to add to your component
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }
    
    // Format: "DD MMM YYYY" (e.g., "15 Apr 2025")
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    // Alternative format options:
    
    // Format: "DD/MM/YYYY" (e.g., "15/04/2025")
    // return date.toLocaleDateString('en-IN', {
    //   day: '2-digit',
    //   month: '2-digit',
    //   year: 'numeric'
    // });
    
    // Format: "DD-MM-YYYY" (e.g., "15-04-2025")
    // return date.getDate().toString().padStart(2, '0') + '-' + 
    //   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
    //   date.getFullYear();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
  // Reusable components for better organization
  const StatCard = ({ title, value, gradient, icon: Icon }) => (
    <div className={`bg-gradient-to-r ${gradient} p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <Icon className="text-white opacity-80" size={24} />
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );

  // Loading component with better visual feedback
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <h1 className="text-3xl font-semibold text-gray-800">Loading Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-200 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-1/4 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced error component
  const ErrorScreen = ({ message }) => (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6 text-red-600">
          <AlertCircle size={32} />
          <h1 className="text-3xl font-semibold">Dashboard Error</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <p className="text-lg">{message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </div>
  );

  // Handle loading state
  if (ipoData.loading || smeData.loading) {
    return <LoadingScreen />;
  }

  // Handle error state
  if (ipoData.error || smeData.error) {
    return <ErrorScreen message={ipoData.error || smeData.error} />;
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">IPO Dashboard</h1>
          <p className="text-gray-600 mb-4">Real-time overview of Initial Public Offerings and SMEs</p>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 pb-2">
            <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
              Overview
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">
              Recent IPOs
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">
              SME Listings
            </button>
          </div>
        </div>
        
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total IPOs" 
            value={totalIPOs} 
            gradient="from-blue-500 to-blue-700" 
            icon={ArrowUp} 
          />
          <StatCard 
            title="Upcoming IPOs" 
            value={upcomingIPOs} 
            gradient="from-purple-500 to-purple-700" 
            icon={Calendar} 
          />
          <StatCard 
            title="Active IPOs" 
            value={activeIPOs} 
            gradient="from-green-500 to-green-700" 
            icon={Clock} 
          />
          <StatCard 
            title="Listed IPOs" 
            value={listedIPOs} 
            gradient="from-amber-500 to-amber-700" 
            icon={CheckCircle} 
          />
        </div>
        
        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          
          {ipoData.ipoList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Company</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Open Date</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Close Date</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Issue Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ipoData.ipoList.slice(0, 5).map((ipo, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{ipo.ipoName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ipo.ipoStatus === 'upcoming' ? 'bg-purple-100 text-purple-800' :
                          ipo.ipoStatus === 'live' ? 'bg-green-100 text-green-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ipo.ipoStatus.charAt(0).toUpperCase() + ipo.ipoStatus.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(ipo.openDate)}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(ipo.closeDate)}</td>
                      <td className="py-3 px-4 text-gray-600">₹{ipo.showPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent IPO data available
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Link to="/ipos" className="text-blue-600 hover:text-blue-800 font-medium">
              View All IPOs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;