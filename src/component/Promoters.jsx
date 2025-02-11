import React from 'react';
import PropTypes from 'prop-types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const PromotersSection = ({ promoters, setPromoters }) => {
    const addPromoter = () => {
      setPromoters([...promoters, { name: '' }]);
    };
  
    const removePromoter = (index) => {
      const updatedPromoters = promoters.filter((_, i) => i !== index);
      setPromoters(updatedPromoters);
    };
  
    const updatePromoter = (index, value) => {
      const updatedPromoters = promoters.map((promoter, i) => {
        if (i === index) {
          return { ...promoter, name: value };
        }
        return promoter;
      });
      setPromoters(updatedPromoters);
    };
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Promoters Information</h3>
          <button
            type="button"
            onClick={addPromoter}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition duration-300 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Promoter</span>
          </button>
        </div>
  
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pre-Issue Shareholding (%)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post-Issue Shareholding (%)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
  
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Company Promoters
            </label>
            {promoters.map((promoter, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 animate-fadeIn"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={promoter.name}
                    onChange={(e) => updatePromoter(index, e.target.value)}
                    placeholder={`Promoter ${index + 1} Name`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      pr-10" // Extra padding for the remove button
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePromoter(index)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2
                      text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {promoters.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No promoters added yet. Click "Add Promoter" to begin.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
PromotersSection.propTypes = {
  promoters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setPromoters: PropTypes.func.isRequired,
};

export default PromotersSection;