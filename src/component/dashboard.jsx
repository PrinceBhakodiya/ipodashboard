import React, { useState } from 'react';
import MainDashboard from './MainDashboard';
import ViewIPO from './viewIPO';

import AddIPO from './AddIPO';

import AddSME from './AddSME';
import ViewSME from './ViewSME';
import Notification from './Notification';
import { PlusCircle, FileEdit ,BellIcon} from 'lucide-react';

const MenuItem = ({ icon: Icon, text, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full mb-3 px-4 py-3 rounded-xl flex items-center
      transition-all duration-300 ease-in-out
      ${selected 
        ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white transform translate-x-2' 
        : 'hover:bg-blue-50 hover:translate-x-2 text-gray-700'}
    `}
  >
    <div className={`
      w-10 h-10 rounded-lg flex items-center justify-center mr-4
      transition-all duration-300
      ${selected 
        ? 'bg-white/20' 
        : 'bg-blue-100'}
    `}>
      <Icon 
        size={24} 
        className={`transition-colors duration-300 ${selected ? 'text-white' : 'text-blue-500'}`}
      />
    </div>
    <span className={`font-medium ${selected ? 'text-white' : 'text-gray-700'}`}>
      {text}
    </span>
  </button>
);

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('mainDashboard');


  const handleLogout = () => {

         localStorage.removeItem('isAuthenticated'); // Remove authentication status

    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'mainDashboard', icon: PlusCircle, text: 'Dashboard' },
    { id: 'addIPO', icon: PlusCircle, text: 'Add IPO' },
    { id: 'viewIPO', icon: FileEdit, text: 'View IPO' },
    { id: 'notification', icon:BellIcon, text: 'Notifications' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        <div className="p-6 pb-4">
        <div className="h-10 w-32 bg-gray-50 rounded-lg mb-8 text-center text-lg font-medium text-black">IPOGURU</div> {/* Updated text style */}
        <nav>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                selected={selectedMenu === item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    handleLogout();
                  } else {
                    setSelectedMenu(item.id);
                  }
                }}
              />
            ))}
            <MenuItem
              id="logout"
              icon={BellIcon}
              text="Logout"
              selected={false}
              onClick={handleLogout}
            />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">IPOGURU Dashboard</h1>
              <button onClick={handleLogout} className="bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition duration-300">Logout</button>
            </div>
            {selectedMenu === 'mainDashboard' && <MainDashboard />}
            {selectedMenu === 'viewIPO' && <ViewIPO />}
            {selectedMenu === 'addIPO' && <AddIPO />}
            {selectedMenu === 'notification' && <Notification />}
          </>
         
      </div>
    </div>
  );
};

export default Dashboard;