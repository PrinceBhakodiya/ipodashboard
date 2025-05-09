import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const GmpHistoryCard = ({ ipoId, className }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGmpHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://64.227.159.217:5000/api/ipo/${ipoId}/gmp-history`);
        const data = await response.json();
        
        if (data.success && data.history.length > 0) {
          // Format data for the chart
          const formattedData = data.history.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short'
            }),
            value: entry.value || 0,
            percentage: entry.percentage || 0
          }));
          
          // Sort by date (oldest first for chart)
          formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
          setHistoryData(formattedData);
        } else {
          setHistoryData([]);
        }
      } catch (err) {
        console.error("Error fetching GMP history:", err);
        setError("Failed to load GMP history");
      } finally {
        setLoading(false);
      }
    };

    if (ipoId) {
      fetchGmpHistory();
    }
  }, [ipoId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="flex items-center text-gray-500">
          <Clock size={16} className="mr-2" />
          <p className="text-sm">No GMP history available</p>
        </div>
      </div>
    );
  }

  // Calculate GMP trend (positive, negative or neutral)
  const calculateTrend = () => {
    if (historyData.length < 2) return { direction: 'neutral', change: 0 };
    
    const current = historyData[historyData.length - 1].value;
    const previous = historyData[historyData.length - 2].value;
    const change = current - previous;
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change),
      changePercentage: previous ? (Math.abs(change) / previous * 100).toFixed(1) : 0
    };
  };

  const trend = calculateTrend();
  const latestValue = historyData[historyData.length - 1].value;
  const latestPercentage = historyData[historyData.length - 1].percentage;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">GMP History</h3>
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">
              {historyData.length} data points
            </span>
          </div>
        </div>
        
        {/* Current GMP value with trend */}
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold mr-2">₹{latestValue}</span>
          <span className="text-gray-500 mr-2">({latestPercentage}%)</span>
          {trend.direction !== 'neutral' && (
            <div className={`flex items-center text-xs font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUp size={16} className="mr-1" />
              ) : (
                <ArrowDown size={16} className="mr-1" />
              )}
              ₹{trend.change} ({trend.changePercentage}%)
            </div>
          )}
        </div>
        
        {/* Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                hide
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ fontSize: '12px' }}
                formatter={(value) => [`₹${value}`, 'GMP']} 
              />
              <Line 
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GmpHistoryCard;