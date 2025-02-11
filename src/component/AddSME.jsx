import React, { useState } from 'react';

const AddSME = () => {
  const [newSme, setNewSme] = useState({
    name: '',
    price: '',
    offerStartDate: '',
    offerEndDate: '',
    offerPrice: '',
    lotSize: '',
    subscriptions: '',
    gmp: '',
    allotmentDate: '',
    refundInitiation: '',
    dematTransfer: '',
    listingDate: '',
    comments: '',
    allotmentLink: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here
    console.log(newSme);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add SME</h1>
      <div className="mb-4">
        <label className="block text-gray-700">SME Name</label>
        <input
          type="text"
          value={newSme.name}
          onChange={(e) => setNewSme({ ...newSme, name: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          value={newSme.price}
          onChange={(e) => setNewSme({ ...newSme, price: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Offer Start Date</label>
        <input
          type="date"
          value={newSme.offerStartDate}
          onChange={(e) => setNewSme({ ...newSme, offerStartDate: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Offer End Date</label>
        <input
          type="date"
          value={newSme.offerEndDate}
          onChange={(e) => setNewSme({ ...newSme, offerEndDate: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Offer Price</label>
        <input
          type="number"
          value={newSme.offerPrice}
          onChange={(e) => setNewSme({ ...newSme, offerPrice: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Lot Size</label>
        <input
          type="number"
          value={newSme.lotSize}
          onChange={(e) => setNewSme({ ...newSme, lotSize: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Subscriptions</label>
        <input
          type="text"
          value={newSme.subscriptions}
          onChange={(e) => setNewSme({ ...newSme, subscriptions: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">GMP</label>
        <input
          type="text"
          value={newSme.gmp}
          onChange={(e) => setNewSme({ ...newSme, gmp: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Allotment Date</label>
        <input
          type="date"
          value={newSme.allotmentDate}
          onChange={(e) => setNewSme({ ...newSme, allotmentDate: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Refund Initiation Date</label>
        <input
          type="date"
          value={newSme.refundInitiation}
          onChange={(e) => setNewSme({ ...newSme, refundInitiation: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Demat Transfer Date</label>
        <input
          type="date"
          value={newSme.dematTransfer}
          onChange={(e) => setNewSme({ ...newSme, dematTransfer: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Listing Date</label>
        <input
          type="date"
          value={newSme.listingDate}
          onChange={(e) => setNewSme({ ...newSme, listingDate: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Comments</label>
        <textarea
          value={newSme.comments}
          onChange={(e) => setNewSme({ ...newSme, comments: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Allotment Link</label>
        <input
          type="url"
          value={newSme.allotmentLink}
          onChange={(e) => setNewSme({ ...newSme, allotmentLink: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 px-4">
        Add SME
      </button>
    </form>
  );
};

export default AddSME; 