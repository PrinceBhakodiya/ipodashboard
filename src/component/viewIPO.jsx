import { Loader2 } from 'lucide-react';
import moment from 'moment';
import React, { useState,useEffect } from 'react';
import AddIPO from './AddIPO';
import UpdateIPO from './UpdateIPO';

const ViewIPO = () => {
  
const [ipoList, setIpoList] = useState([]);
const [selectedIpo, setSelectedIpo] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [editedIpo, setEditedIpo] = useState(null);
const [confirmDelete, setConfirmDelete] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [activeTab, setActiveTab] = useState('Upcoming');
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


  const fetchIpos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ipo-6thl.onrender.com/api/ipo?status=all');
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
  const confirmDeleteIpo = async () => {
    try {
      const response = await fetch(`https://ipo-6thl.onrender.com/api/ipo/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete IPO');
      }

      setIpoList(ipoList.filter(ipo => ipo._id !== deleteId));
      closeModal();
    } catch (err) {
      setError('Failed to delete IPO. Please try again.');
      console.error('Error deleting IPO:', err);
    }
  };

  // Update IPO
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ipo-6thl.onrender.com/api/ipo/${editedIpo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedIpo),
      });

      if (!response.ok) {
        throw new Error('Failed to update IPO');
      }

      const updatedIpo = await response.json();
      setIpoList(ipoList.map(ipo => (ipo._id === updatedIpo._id ? updatedIpo : ipo)));
      closeModal();
    } catch (err) {
      setError('Failed to update IPO. Please try again.');
      console.error('Error updating IPO:', err);
    }
  };

  useEffect(() => {
    fetchIpos();
  }, []);


  const handleCardClick = (ipo) => {
    setSelectedIpo(ipo);
    console.log("clicked")
  };
  const closeModal = () => {
    setSelectedIpo(null);
    setIsEditing(false);
    setEditedIpo(null);
    setConfirmDelete(false);
    setError(null);
  };

  const handleEditClick = (ipo) => {
    setIsEditing(true);
    setEditedIpo(ipo);
    console.log(ipo)

  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading IPOs...</span>
      </div>
    );
  }


  const renderIpoCards = () => {
    // console.log(ipoList[0].ipoStatus)
    return ipoList
      .filter(ipo => ipo.ipoStatus == activeTab.toLowerCase())
      .map((ipo) => (
        <div 
          key={ipo._id} 
          className="border border-gray-300 rounded-lg p-4 shadow-lg transition-transform duration-300 hover:scale-105 bg-white cursor-pointer mb-4"
          onClick={() => handleCardClick(ipo)}
        >
            {ipo.ipoLogo && (
                    <div className="flex justify-left">
                      <img src={ipo.ipoLogo} alt="Company Logo" className="h-24 w-24 object-contain" />
                    </div>
                  )}
          <h2 className="text-xl font-semibold text-gray-800">{ipo.ipoName}</h2>
        
          <p className="text-gray-600">Offer Price: <span className="font-bold text-blue-600">${ipo.showPrice}</span></p>
          <p className="text-gray-600">Allotment Date:  {moment(ipo.allotmentDate).format('DD/MM/YYYY')}</p>
          <p className="text-gray-600">Offer Date:  {moment(ipo.offerStartDate).format('DD/MM/YYYY')} - {moment(ipo.offerEndDate).format('DD/MM/YYYY')}  </p>
          {/* <p className="text-gray-600">Offer End: {ipo.offerEndDate}</p> */}
          {/* <p className="text-gray-600">Offer Price: ${ipo.offerPrice}</p> */}
          <p className="text-gray-600">Lot Size: {ipo.lotSize}</p>
          <p className="text-gray-600">Subscriptions: {ipo.subscriptions}</p>
          <p className="text-gray-600">GMP:  <span
    className={`font-medium ${
       ipo.premiumGMP ==null? '' :ipo.premiumGMP.value > 0 ? 'text-green-500' : 'text-red-500'
    }`}
  >
      {ipo.premiumGMP==null ? '':ipo.premiumGMP.value ?? ''} ({ipo.premiumGMP==null ? '': ipo.premiumGMP.percentage ?? ''}%)</span></p>
          <p className="text-gray-600">Refund Initiation: {moment(ipo.refundsDate).format('DD/MM/YYYY')}</p>
          <p className="text-gray-600">Demat Transfer: {moment(ipo.dem).format('DD/MM/YYYY')}</p>
          <p className="text-gray-600">Listing Date: {moment(ipo.listingDate).format('DD/MM/YYYY')} </p>
          <p className="text-gray-600">Company Description : {ipo.companyDescription}</p>
          <div className="mt-4">
            <button onClick={() => handleEditClick(ipo)} className="bg-blue-500 text-white rounded-lg py-1 px-4 mr-2 hover:bg-blue-600 transition duration-300 h-10 w-50">Edit</button>
            <button onClick={() => handleDeleteClick(ipo._id)} className="bg-red-500 text-white rounded-lg py-1 px-4 hover:bg-red-600 transition duration-300 w-50 h-10">Delete</button>
            
          </div>
        </div>
      ));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">View IPOs</h1>
      {/* {error && (
        // <Alert variant="destructive" className="mb-4">
        //   <AlertDescription>{error}</AlertDescription>
        // </Alert>
      )} */}

      {/* Tab Bar for IPO Status */}
      <div className="flex space-x-4 mb-4">
        {['Upcoming', 'Live', 'Listed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded-lg ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-4 mt-4">
        {renderIpoCards()}
      </div>
      {/* Conditional rendering of the modal */}
      {isEditing && (
        <AddIPO editData={selectedIpo} isEdit={true} />
      )}


      {/* Modal for Editing IPO */}
      {/* {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">Edit IPO</h2>
            <div className="mb-4">
              <label className="block text-gray-700">IPO Name</label>
              <input
                type="text"
                value={editedIpo.ipoName}
                onChange={(e) => setEditedIpo({ ...editedIpo, ipoName: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Start Price</label>
              <input
                type="number"
                value={editedIpo.startPrice}
                onChange={(e) => setEditedIpo({ ...editedIpo, startPrice: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">End Price</label>
              <input
                type="number"
                value={editedIpo.endPrice}
                onChange={(e) => setEditedIpo({ ...editedIpo, endPrice: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Allotment Date</label>
              <input
                type="date"
                value={editedIpo.allotmentDate}
                onChange={(e) => setEditedIpo({ ...editedIpo, allotmentDate: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Offer Start Date</label>
              <input
                type="date"
                value={editedIpo.offerStartDate}
                onChange={(e) => setEditedIpo({ ...editedIpo, offerStartDate: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Offer End Date</label>
              <input
                type="date"
                value={editedIpo.offerEndDate}
                onChange={(e) => setEditedIpo({ ...editedIpo, offerEndDate: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Lot Size</label>
              <input
                type="number"
                value={editedIpo.lotSize}
                onChange={(e) => setEditedIpo({ ...editedIpo, lotSize: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subscriptions</label>
              <input
                type="text"
                value={editedIpo.subscriptions}
                onChange={(e) => setEditedIpo({ ...editedIpo, subscriptions: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">GMP Value</label>
              <input
                type="number"
                value={editedIpo.premiumGMP.value}
                onChange={(e) => setEditedIpo({ 
                  ...editedIpo, 
                  premiumGMP: { ...editedIpo.premiumGMP, value: e.target.value }
                })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">GMP Percentage</label>
              <input
                type="number"
                value={editedIpo.premiumGMP.percentage}
                onChange={(e) => setEditedIpo({ 
                  ...editedIpo, 
                  premiumGMP: { ...editedIpo.premiumGMP, percentage: e.target.value }
                })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Refunds Date</label>
              <input
                type="date"
                value={editedIpo.refundsDate}
                onChange={(e) => setEditedIpo({ ...editedIpo, refundsDate: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Demat Transfer Date</label>
              <input
                type="date"
                value={editedIpo.dem}
                onChange={(e) => setEditedIpo({ ...editedIpo, dem: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Listing Date</label>
              <input
                type="date"
                value={editedIpo.listingDate}
                onChange={(e) => setEditedIpo({ ...editedIpo, listingDate: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Company Description</label>
              <textarea
                value={editedIpo.companyDescription}
                onChange={(e) => setEditedIpo({ ...editedIpo, companyDescription: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">IPO Status</label>
              <select
                value={editedIpo.ipoStatus}
                onChange={(e) => setEditedIpo({ ...editedIpo, ipoStatus: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-3"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="listed">Listed</option>
              </select>
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-500 transition duration-300 w-full">Save Changes</button>
          </form>
        </div>
      )} */}

      {/* Confirmation Modal for Deletion */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600">Are you sure you want to delete this IPO?</p>
            <div className="mt-4">
              <button onClick={confirmDeleteIpo} className="bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg py-2 px-4 mr-2 hover:bg-red-500 transition duration-300">Delete</button>
              <button onClick={closeModal} className="bg-gray-300 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-400 transition duration-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewIPO;