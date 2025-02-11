import React, { useState } from 'react';

const Notification = ({  }) => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [notifications, setNotifications] = useState([]);

  const handleSendNotification = () => {
    const newNotification = {
      title: notificationTitle,
      body: notificationBody,
    };
    setNotifications([...notifications, newNotification]);
    setNotificationTitle('');
    setNotificationBody('');
  };

  return (
    <div className="relative">
        
      <div className="mt-2 w-full bg-white rounded-lg shadow-lg z-10">
        <div className="p-4">
          <h2 className="font-semibold">Send Notification</h2>
          <input
            type="text"
            placeholder="Notification Title"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-2"
          />
          <textarea
            placeholder="Notification Body"
            value={notificationBody}
            onChange={(e) => setNotificationBody(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-2"
            rows="3"
          />
          <button onClick={handleSendNotification} className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 transition duration-300">Send</button>
        </div>
      </div>

    
    </div>
  );
};

export default Notification; 