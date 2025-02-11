import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import AddIPO from './AddIPO';

const UpdateIPO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipoData, setIpoData] = useState(null);

  useEffect(() => {
    const fetchIPO = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ipo/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch IPO data');
        }
        const data = await response.json();
        setIpoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIPO();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading IPO data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading IPO</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/ipos')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/ipos')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to IPOs
          </button>
        </div>
        
        {ipoData && (
          <AddIPO isEdit={true} editData={ipoData} />
        )}
      </div>
    </div>
  );
};

export default UpdateIPO; 