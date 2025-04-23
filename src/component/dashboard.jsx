import React, { useState, useEffect } from 'react';
import MainDashboard from './MainDashboard';
import ViewIPO from './viewIPO';
import IPOGuruLogo from './Logo';
import AddIPO from './AddIPO';
import AddSME from './AddSME';
import ViewSME from './ViewSME';
import Notification from './Notification';
import GmpUpdateManager from './updateGMP';
import { 
  LayoutDashboard,
  PlusCircle, 
  FileText, 
  Bell, 
  TrendingUp, 
  LogOut,
  Settings,
  Users,
  ChevronRight,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('mainDashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  
  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Close admin dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (adminDropdownOpen && !event.target.closest('#admin-dropdown')) {
        setAdminDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [adminDropdownOpen]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };
  
  const handleNotificationClick = () => {
    setSelectedMenu('notification');
    setNotificationCount(0); // Reset notification count when viewing notifications
    
    // Close sidebar on mobile after selecting notifications
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Menu items configuration
  const menuItems = [
    { 
      id: 'mainDashboard', 
      icon: LayoutDashboard, 
      text: 'Dashboard',
      description: 'Overview of IPO data' 
    },
    { 
      id: 'addIPO', 
      icon: PlusCircle, 
      text: 'Add IPO',
      description: 'Create new IPO listing' 
    },
    { 
      id: 'viewIPO', 
      icon: FileText, 
      text: 'View IPOs',
      description: 'Manage existing IPOs' 
    },
    { 
      id: 'gmpUpdate', 
      icon: TrendingUp, 
      text: 'GMP Updates',
      description: 'Grey market premium updates' 
    }
  ];

  // Render menu item with consistent styling
  const MenuItem = ({ icon: Icon, text, description, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`
        w-full mb-2 px-4 py-3 rounded-lg flex items-center
        transition-all duration-200 ease-in-out
        ${selected 
          ? 'bg-blue-50 border-l-4 border-blue-500' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'}
      `}
    >
      <Icon
        size={20}
        className={`${selected ? 'text-blue-500' : 'text-gray-500'}`}
      />
      <div className="ml-3 text-left">
        <span className={`block font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
          {text}
        </span>
        {description && (
          <span className="text-xs text-gray-500 hidden md:block">{description}</span>
        )}
      </div>
      {selected && (
        <ChevronRight size={16} className="ml-auto text-blue-500" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center">
            <IPOGuruLogo />
          </div>
          
          {/* Mobile Admin Button */}
          <div id="admin-dropdown" className="relative">
            <button
              onClick={toggleAdminDropdown}
              className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
            >
              AG
            </button>
            
            {/* Mobile Admin Dropdown */}
            {adminDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@ipoguru.com</p>
                </div>
                <button 
                  onClick={handleNotificationClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Bell size={16} className="mr-2" />
                  Notifications
                  {notificationCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile overlay when open, always visible on desktop */}
      <div className={`
        ${sidebarOpen ? 'fixed inset-0 z-40 md:relative md:inset-auto' : 'hidden md:block'}
        w-72 bg-white border-r border-gray-200
      `}>
        {/* Mobile close button */}
        <div className="flex md:hidden justify-end p-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Logo - hidden on mobile as it's in the header */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <IPOGuruLogo />
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Main Menu
            </h3>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                description={item.description}
                selected={selectedMenu === item.id}
                onClick={() => {
                  setSelectedMenu(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              />
            ))}
            
            {/* Notifications Menu Item */}
            <button
              onClick={handleNotificationClick}
              className={`
                w-full mb-2 px-4 py-3 rounded-lg flex items-center
                transition-all duration-200 ease-in-out
                ${selectedMenu === 'notification' 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-50 border-l-4 border-transparent'}
              `}
            >
              <Bell
                size={20}
                className={`${selectedMenu === 'notification' ? 'text-blue-500' : 'text-gray-500'}`}
              />
              <div className="ml-3 text-left">
                <span className={`block font-medium ${selectedMenu === 'notification' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Notifications
                </span>
                <span className="text-xs text-gray-500 hidden md:block">
                  System alerts and messages
                </span>
              </div>
              {notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              {selectedMenu === 'notification' && (
                <ChevronRight size={16} className="ml-2 text-blue-500" />
              )}
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Account
            </h3>
            <MenuItem
              icon={Settings}
              text="Settings"
              description="System preferences"
              selected={selectedMenu === 'settings'}
              onClick={() => {
                setSelectedMenu('settings');
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-medium text-gray-800">
              {selectedMenu === 'notification' 
                ? 'Notifications' 
                : selectedMenu === 'settings' 
                  ? 'Settings' 
                  : menuItems.find(item => item.id === selectedMenu)?.text || 'Dashboard'}
            </h1>
            
            {/* Right Side - Logo and Admin */}
            <div className="flex items-center space-x-4">
              {/* Notification Button */}
              <button 
                onClick={handleNotificationClick}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* Admin Dropdown */}
              <div id="admin-dropdown" className="relative">
                <button
                  onClick={toggleAdminDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    AG
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="block text-sm font-medium text-gray-700">Admin</span>
                    <span className="block text-xs text-gray-500">admin@ipoguru.com</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {/* Admin Dropdown Menu */}
                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@ipoguru.com</p>
                    </div>
                    <button 
                      onClick={() => setSelectedMenu('settings')} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Mobile Page Title */}
          <div className="md:hidden mb-4">
            <h1 className="text-xl font-medium text-gray-800">
              {selectedMenu === 'notification' 
                ? 'Notifications' 
                : selectedMenu === 'settings' 
                  ? 'Settings' 
                  : menuItems.find(item => item.id === selectedMenu)?.text || 'Dashboard'}
            </h1>
          </div>
          
          {/* Content based on selected menu */}
          <div className="h-full">
            {selectedMenu === 'mainDashboard' && <MainDashboard />}
            {selectedMenu === 'viewIPO' && <ViewIPO />}
            {selectedMenu === 'addIPO' && <AddIPO />}
            {selectedMenu === 'notification' && <Notification />}
            {selectedMenu === 'gmpUpdate' && <GmpUpdateManager />}
            {selectedMenu === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Account Settings</h2>
                
                {/* Settings Sections */}
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h3>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl">
                        AG
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-sm text-gray-500">admin@ipoguru.com</p>
                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                          Change profile photo
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification Settings */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Push notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 mb-3 block">
                      Change password
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-800 block">
                      Two-factor authentication
                    </button>
                  </div>
                  
                  {/* Logout Button */}
                  <div>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout from Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;