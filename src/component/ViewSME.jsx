import React, { useState } from 'react';

const ViewSME = () => {
  const [smeList, setSmeList] = useState([
    {
      name: 'Tech Solutions Ltd.',
      price: 20.00,
      offerStartDate: '2023-11-01',
      offerEndDate: '2023-11-10',
      offerPrice: 20.00,
      lotSize: 100,
      subscriptions: '15x',
      gmp: '4%',
      allotmentDate: '2023-12-01',
      refundInitiation: '2023-12-02',
      dematTransfer: '2023-12-03',
      listingDate: '2023-12-05',
      comments: 'High demand expected.',
    },
    {
      name: 'Green Energy Corp.',
      price: 30.00,
      offerStartDate: '2023-10-15',
      offerEndDate: '2023-10-20',
      offerPrice: 30.00,
      lotSize: 50,
      subscriptions: '8x',
      gmp: '3%',
      allotmentDate: '2023-11-15',
      refundInitiation: '2023-11-16',
      dematTransfer: '2023-11-17',
      listingDate: '2023-11-20',
      comments: 'Good growth potential.',
    },
  ]);
  const [selectedSme, setSelectedSme] = useState(null);

  const handleCardClick = (sme) => {
    setSelectedSme(sme);
  };

  const closeModal = () => {
    setSelectedSme(null);
  };

  const renderSmeCards = () => {
    return smeList.map((sme, index) => (
      <div 
        key={index} 
        className="border border-gray-300 rounded-lg p-4 shadow-lg transition-transform duration-300 hover:scale-105 bg-white cursor-pointer mb-4"
        onClick={() => handleCardClick(sme)}
      >
        <h2 className="text-xl font-semibold text-gray-800">{sme.name}</h2>
        <p className="text-gray-600">Price: <span className="font-bold text-blue-600">${sme.price}</span></p>
        <p className="text-gray-600">Allotment Date: {sme.allotmentDate}</p>
        <p className="text-gray-600">Offer Start: {sme.offerStartDate}</p>
        <p className="text-gray-600">Offer End: {sme.offerEndDate}</p>
        <p className="text-gray-600">Offer Price: ${sme.offerPrice}</p>
        <p className="text-gray-600">Lot Size: {sme.lotSize}</p>
        <p className="text-gray-600">Subscriptions: {sme.subscriptions}</p>
        <p className="text-gray-600">GMP: <span className="font-bold">{sme.gmp}</span></p>
        <p className="text-gray-600">Refund Initiation: {sme.refundInitiation}</p>
        <p className="text-gray-600">Demat Transfer: {sme.dematTransfer}</p>
        <p className="text-gray-600">Listing Date: {sme.listingDate}</p>
        <p className="text-gray-600">Comments: {sme.comments}</p>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">View SMEs</h1>
      <div className="flex flex-col space-y-4 mt-4">
        {renderSmeCards()}
      </div>

      {/* Modal for SME Details */}
      {selectedSme && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/2">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{selectedSme.name}</h2>
            <p className="text-gray-600">Price: <span className="font-bold text-blue-600">${selectedSme.price}</span></p>
            <p className="text-gray-600">Allotment Date: {selectedSme.allotmentDate}</p>
            <p className="text-gray-600">Offer Start: {selectedSme.offerStartDate}</p>
            <p className="text-gray-600">Offer End: {selectedSme.offerEndDate}</p>
            <p className="text-gray-600">Offer Price: ${selectedSme.offerPrice}</p>
            <p className="text-gray-600">Lot Size: {selectedSme.lotSize}</p>
            <p className="text-gray-600">Subscriptions: {selectedSme.subscriptions}</p>
            <p className="text-gray-600">GMP: <span className="font-bold">{selectedSme.gmp}</span></p>
            <p className="text-gray-600">Refund Initiation: {selectedSme.refundInitiation}</p>
            <p className="text-gray-600">Demat Transfer: {selectedSme.dematTransfer}</p>
            <p className="text-gray-600">Listing Date: {selectedSme.listingDate}</p>
            <p className="text-gray-600">Comments: {selectedSme.comments}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSME; 