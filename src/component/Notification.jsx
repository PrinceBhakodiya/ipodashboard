import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notification = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, type: '', message: '' });
  
  // IPO states
  const [ipoList, setIpoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIpo, setSelectedIpo] = useState(null);
  
  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Fetch IPOs on component mount
  useEffect(() => {
    fetchIpos();
  }, []);

  // Function to fetch IPOs
  const fetchIpos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://64.227.159.217:5000/api/ipo?status=all');
      if (!response.ok) {
        throw new Error('Failed to fetch IPOs');
      }
      const data = await response.json();
      setIpoList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load IPOs. Please try again later.');
      console.error('Error fetching IPOs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-built notification templates
  const notificationTemplates = {
    upcoming: {
      title: "IPO Coming Soon",
      body: "will open on {openDate}. Price band: ₹{showPrice} - ₹{highPrice}. Get ready to apply!"
    },
    open: {
      title: "IPO Now Open",
      body: "is now open for subscription until {closeDate}. Lot size: {lotSize} shares. Don't miss this opportunity!"
    },
    allotment: {
      title: "IPO Allotment Soon",
      body: "subscription is closed. Allotment expected on {allotmentDate}. Stay tuned for results!"
    },
    listed: {
      title: "Now Listed",
      body: "has successfully listed on the stock exchange. Check out the latest price and performance!"
    },
    customReminder: {
      title: "IPO Reminder",
      body: "Don't forget to apply before the closing date of {closeDate}!"
    }
  };

  // Handle IPO selection from dropdown
  const handleIpoSelect = (e) => {
    const ipoId = e.target.value;
    if (!ipoId) {
      setSelectedIpo(null);
      setNotificationTitle('');
      setNotificationBody('');
      return;
    }

    const ipo = ipoList.find(ipo => ipo._id === ipoId);
    setSelectedIpo(ipo);
    
    // If a template is already selected, apply it to the new IPO
    if (selectedTemplate) {
      applyTemplate(selectedTemplate, ipo);
    }
  };

  // Apply a template to the selected IPO
  const applyTemplate = (templateKey, ipo = selectedIpo) => {
    if (!ipo) return;
    
    setSelectedTemplate(templateKey);
    const template = notificationTemplates[templateKey];
    
    // Format dates for templates
    const openDate = ipo.openDate ? new Date(ipo.openDate).toLocaleDateString() : 'TBA';
    const closeDate = ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString() : 'TBA';
    const allotmentDate = ipo.allotmentDate ? new Date(ipo.allotmentDate).toLocaleDateString() : 'TBA';
    
    // Set the title and body with the template
    let title = `${ipo.ipoName} ${template.title}`;
    let body = template.body
      .replace('{openDate}', openDate)
      .replace('{closeDate}', closeDate)
      .replace('{allotmentDate}', allotmentDate)
      .replace('{showPrice}', ipo.showPrice || '')
      .replace('{highPrice}', ipo.highPrice || '')
      .replace('{lotSize}', ipo.lotSize || '');
    
    // Add the IPO name to the beginning of the body if it doesn't contain it
    if (!body.startsWith(ipo.ipoName)) {
      body = `${ipo.ipoName} ${body}`;
    }
    
    setNotificationTitle(title);
    setNotificationBody(body);
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationBody) {
      setStatus({
        show: true,
        type: 'error',
        message: 'Please provide both title and body for the notification'
      });
      setTimeout(() => setStatus({ show: false, type: '', message: '' }), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://64.227.159.217:5000/api/ipo/notifications/send', {
        title: notificationTitle,
        body: notificationBody,
        topic: 'all'
      });

      if (response.data.success) {
        const newNotification = {
          title: notificationTitle,
          body: notificationBody,
          timestamp: new Date().toISOString(),
          status: 'Sent',
          ipoId: selectedIpo?._id,
          template: selectedTemplate
        };
        
        setNotifications([newNotification, ...notifications]);
        setNotificationTitle('');
        setNotificationBody('');
        setSelectedIpo(null);
        setSelectedTemplate('');
        
        setStatus({
          show: true,
          type: 'success',
          message: 'Notification sent successfully!'
        });
      } else {
        setStatus({
          show: true,
          type: 'error',
          message: response.data.message || 'Failed to send notification'
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatus({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Error sending notification'
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus({ show: false, type: '', message: '' }), 3000);
    }
  };

  return (
    <div className="relative p-4">
      {status.show && (
        <div className={`px-4 py-3 rounded-lg mb-4 ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
      
      {/* IPO and Template Selection */}
      <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Send IPO Notification</h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : (
          <div className="space-y-4">
            {/* IPO Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select IPO</label>
              <select 
                value={selectedIpo?._id || ''} 
                onChange={handleIpoSelect}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select an IPO --</option>
                {ipoList.map(ipo => (
                  <option key={ipo._id} value={ipo._id}>
                    {ipo.ipoName} ({ipo.ipoStatus ? ipo.ipoStatus.toUpperCase() : 'N/A'})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Notification Template Selection */}
            {selectedIpo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Notification Template</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <button 
                    type="button"
                    onClick={() => applyTemplate('upcoming')}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedTemplate === 'upcoming' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Coming Soon
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('open')}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedTemplate === 'open' 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Now Open
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('allotment')}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedTemplate === 'allotment' 
                        ? 'bg-amber-50 border-amber-500 text-amber-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Allotment
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('listed')}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedTemplate === 'listed' 
                        ? 'bg-purple-50 border-purple-500 text-purple-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Listed
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate('customReminder')}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedTemplate === 'customReminder' 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Notification Form */}
      <div className="w-full bg-white rounded-lg shadow-lg z-10">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            {selectedIpo ? `Notification for ${selectedIpo.ipoName}` : 'Custom Notification'}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title</label>
            <input
              type="text"
              placeholder="e.g., New IPO Alert"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Body</label>
            <textarea
              placeholder="e.g., BoAt IPO is opening tomorrow. Don't miss this opportunity!"
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setSelectedIpo(null);
                setNotificationTitle('');
                setNotificationBody('');
                setSelectedTemplate('');
              }} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Clear
            </button>
            <button 
              onClick={handleSendNotification} 
              disabled={isLoading}
              className={`flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Notifications</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {notifications.map((notification, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notification.body}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {notification.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;