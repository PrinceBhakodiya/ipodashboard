import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle } from 'lucide-react';

const GmpUpdateManager = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeIpo, setActiveIpo] = useState(null);

  // Fetch all IPOs
  useEffect(() => {
    const fetchIpos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://64.227.159.217:5000/api/ipo?status=live');
        const data = await response.json();
        
        // Sort by status to bring live and upcoming ones first
        const sortedData = data.sort((a, b) => {
          const statusOrder = { 'live': 0, 'upcoming': 1, 'allotment out': 2, 'listed': 3 };
          return (statusOrder[a.ipoStatus] || 999) - (statusOrder[b.ipoStatus] || 999);
        });
        
        setIpos(sortedData);
      } catch (err) {
        console.error('Error fetching IPOs:', err);
        setError('Failed to load IPOs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIpos();
  }, []);

  // Handle updating GMP for a specific IPO
  const handleGmpUpdate = async (ipo, newValue, newPercentage) => {
    try {
      const response = await fetch(`http://64.227.159.217:5000/api/ipo/${ipo._id}/update-gmp`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: parseFloat(newValue),
          percentage: parseFloat(newPercentage),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state to reflect changes
        setIpos(prevIpos => 
          prevIpos.map(i => 
            i._id === ipo._id 
              ? { ...i, premiumGMP: data.updatedGMP }
              : i
          )
        );
        
        setSuccessMessage(`GMP updated for ${ipo.ipoName}`);
        setActiveIpo(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || 'Failed to update GMP');
      }
    } catch (err) {
      console.error('Error updating GMP:', err);
      setError('Failed to update GMP. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">GMP Update Manager</h2>
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4 flex items-center">
          <CheckCircle className="mr-2" size={20} />
          {successMessage}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IPO Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current GMP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ipos.map(ipo => (
              <React.Fragment key={ipo._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {ipo.ipoLogo && (
                        <img className="h-10 w-10 rounded-full mr-3" src={ipo.ipoLogo} alt={ipo.ipoName} />
                      )}
                      <div className="text-sm font-medium text-gray-900">{ipo.ipoName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${ipo.ipoStatus === 'live' ? 'bg-green-100 text-green-800' : 
                        ipo.ipoStatus === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        ipo.ipoStatus === 'listed' ? 'bg-gray-100 text-gray-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {ipo.ipoStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{ipo.startPrice} - ₹{ipo.endPrice || ipo.highPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ipo.premiumGMP ? (
                        <>
                          <span className={ipo.premiumGMP.value > 0 ? 'text-green-600' : ipo.premiumGMP.value < 0 ? 'text-red-600' : 'text-gray-600'}>
                            ₹{ipo.premiumGMP.value || 0}
                          </span>
                          {' '}
                          <span className="text-gray-500">
                            ({ipo.premiumGMP.percentage || 0}%)
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">No GMP data</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setActiveIpo(activeIpo === ipo._id ? null : ipo._id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Update GMP
                    </button>
                  </td>
                </tr>
                
                
                {/* Expandable GMP Update Form */}
                {activeIpo === ipo._id && (
                    
                  <tr>
                    <td colSpan="5" className="px-6 py-4 bg-blue-50">
                      <UpdateGmpForm 
                        ipo={ipo} 
                        onUpdate={handleGmpUpdate} 
                        onCancel={() => setActiveIpo(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UpdateGmpForm = ({ ipo, onUpdate, onCancel }) => {
  const [gmpValue, setGmpValue] = useState(ipo.premiumGMP?.value || '');
  const [gmpPercentage, setGmpPercentage] = useState(ipo.premiumGMP?.percentage || '');

  // Calculate percentage when value changes
  const handleValueChange = (value) => {
    setGmpValue(value);
    
    if (value) {
      const endPrice = ipo.endPrice || ipo.highPrice;
      if (endPrice) {
        const calculatedPercentage = ((value / endPrice) * 100).toFixed(2);
        setGmpPercentage(calculatedPercentage);
      }
    }
  };

  // Calculate value when percentage changes
  const handlePercentageChange = (percentage) => {
    setGmpPercentage(percentage);
    
    if (percentage) {
      const endPrice = ipo.endPrice || ipo.highPrice;
      if (endPrice) {
        const calculatedValue = ((percentage / 100) * endPrice).toFixed(2);
        setGmpValue(calculatedValue);
      }
    }
  };

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Update GMP for {ipo.ipoName}</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GMP Value (₹)
          </label>
          <input
            type="number"
            step="0.01"
            value={gmpValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GMP Percentage (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={gmpPercentage}
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onUpdate(ipo, gmpValue, gmpPercentage)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <RefreshCw size={16} className="mr-2" />
          Update GMP
        </button>
      </div>
    </div>
  );
};

export default GmpUpdateManager;