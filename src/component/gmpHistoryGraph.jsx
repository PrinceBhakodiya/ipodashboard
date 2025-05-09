import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GmpHistoryGraph = ({ ipoId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGmpHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://64.227.159.217:5000/api/ipo/${ipoId}/gmp-history`);
        const data = await response.json();
        
        if (data.success) {
          // Format data for the chart - convert dates and sort chronologically
          const formattedData = data.history.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            value: item.value,
            percentage: item.percentage
          }));
          
          // Sort by date (oldest first for the chart)
          formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setHistoryData(formattedData);
        } else {
          setError(data.message || 'Failed to load GMP history');
        }
      } catch (err) {
        console.error('Error fetching GMP history:', err);
        setError('Error loading GMP history data');
      } finally {
        setLoading(false);
      }
    };

    if (ipoId) {
      fetchGmpHistory();
    }
  }, [ipoId]);

  if (loading) {
    return <div className="loading-spinner">Loading GMP history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (historyData.length === 0) {
    return <div className="no-data-message">No GMP history available for this IPO</div>;
  }

  return (
    <div className="gmp-history-chart">
      <h3>GMP Value History</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'GMP Value']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="GMP Value (₹)" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="mt-6">GMP Percentage History</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'GMP Percentage']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              name="GMP Percentage (%)" 
              stroke="#82ca9d" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GmpHistoryGraph;