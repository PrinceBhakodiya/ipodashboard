import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import PromotersSection from './Promoters.jsx'
import { 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,XCircleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { propTypesObject } from '@material-tailwind/react/types/components/checkbox.js';


// Custom Input Component with enhanced features

const AddIPO = ({ isEdit = false, editData = null }) => {
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState({
    numberOfPieces: 0,
    recycle: false
  });
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [newIpo, setNewIpo] = useState({
    ipoName: '',
    ipoLogo: '',
    aboutCompany:'',
    
    offerDate: '',
    startPrice: '',
    endPrice: '',
    // offerEndPrice: '',
    lotSize: '',
    subscription: '',
    premiumGMP: {
      percentage: '',
      value: ''
    },
    openDate: '',
    closeDate: '',
    allotmentDate: '',
    refundsDate: '',
    dematTransferDate: '',
    listingDate: '',
    allotmentLink: '',
    companyDescription: '',
    
    faceValue: '',
    issuePrice: '',
    issueSize: '',
    freshIssue: '',
    offerForSale: '',
    retailQuota: '',
    qibQuota: '',
    hniQuota: '',
    retailApp: '',
    shniApp: '',
    bhniApp: '',
    issueType: '',
    listingAt: '',
    registrar: '',
    drhpUrl: '',
    rhpUrl:'',
    anchorList:'',
    valuations: {
      eps: '',
      peRatio: '',
      ronw: '',
      nav: ''
    },
    financials: [
      {
        period: '',
        assets: '',
        revenue: '',
        profit: ''
      }
    ],
    
    lotDetails: {
      retail: {
        min: { lots: '', shares: '', amount: '' },
        max: { lots: '', shares: '', amount: '' }
      },
      shni: {
        min: { lots: '', shares: '', amount: '' },
        max: { lots: '', shares: '', amount: '' }
      },
      bhni: { 
        lots: '',
        shares: '',
        amount: ''
      }
    },
  });

  const validateDate = (date) => {
    if (!date) return false;
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const selectedDate = new Date(date);
    return selectedDate >= startOfCurrentMonth && selectedDate <= endOfNextMonth;
  };
  
  const handleDateChange = (field, value) => {
    console.log(validateDate(value))
    if (validateDate(value)) {
      setNewIpo({ ...newIpo, [field]: value });
      // showNotification('success', `${field} is a valid date.`);
    } else {
      showNotification(
        'error',
        `${field} must be a date within the current or next month.`
      );
    }
  };
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [promoters, setPromoters] = useState([{ name: '' }]);
  const [leadManagers, setLeadManagers] = useState([{name:''}]);
  const [imagePreview, setImagePreview] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const triggerConfetti = () => {
    // Initial burst
    setShowConfetti(true);
    setConfettiConfig({
      numberOfPieces: 200,
      recycle: false,
      gravity: 0.5,
      initialVelocityY: 20,
      initialVelocityX: 5,
      spread: 90, // Spread angle in degrees
      origin: { x: 0.5, y: 0 }, // Start from top center
      colors: ['#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24', '#FF6B6B'],
      ticks: 300,
    });

    // Gradually reduce confetti
    setTimeout(() => {
      setConfettiConfig(prev => ({
        ...prev,
        numberOfPieces: 100,
      }));
    }, 1000);

    setTimeout(() => {
      setConfettiConfig(prev => ({
        ...prev,
        numberOfPieces: 50,
      }));
    }, 2000);

    // Stop confetti
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Function to remove empty fields from an object
      const removeEmptyFields = (obj) => {
        const cleanObj = {};
      
        Object.entries(obj).forEach(([key, value]) => {
          // Handle nested objects
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nestedClean = removeEmptyFields(value);
            if (Object.keys(nestedClean).length > 0) {
              cleanObj[key] = nestedClean;
            }
          }
          // Handle arrays of objects for promoters and leadManagers
          else if (Array.isArray(value) && (key === 'promoters' || key === 'leadManagers')) {
            const cleanArray = value
              .filter(item => item && (typeof item === 'string' ? item.trim() !== '' : item.name?.trim() !== ''))
              .map(item => typeof item === 'string' ? { name: item } : { name: item.name });
            if (cleanArray.length > 0) {
              cleanObj[key] = cleanArray;
            }
          }
          // Handle other arrays
          else if (Array.isArray(value)) {
            const cleanArray = value.filter(item => item !== null && item !== '');
            if (cleanArray.length > 0) {
              cleanObj[key] = cleanArray;
            }
          }
          // Handle simple values - include 0 as a valid value
          else if (value !== '' && value !== null && value !== undefined) {
            cleanObj[key] = value;
          } else if (value === 0) {
            cleanObj[key] = 0;
          }
        });
      
        return cleanObj;
      };
      
      // Clean the data before sending
      const cleanedData = removeEmptyFields({
        ...newIpo,
        promoters: promoters ? promoters.map(p => ({ name: p.name })) : undefined, 
        leadManagers: leadManagers ? leadManagers.map(m => ({ name: m.name })) : undefined
      });
      
      // Remove undefined keys from the cleaned data
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined) {
          delete cleanedData[key];
        }
      });
      
      // Check if there's any data to submit
      if (Object.keys(cleanedData).length === 0) {
        showNotification('error', 'Please fill in at least one field');
        return;
      }
      
  
      const url = isEdit 
        ? `http://localhost:5000/api/ipo/${editData._id}`
        : 'http://localhost:5000/api/ipo';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData)
      });
  
      if (!response.ok) {
        showNotification('failed', isEdit ? 'Failed to update IPO' : 'Failed to create IPO');
        throw new Error(isEdit ? 'Failed to update IPO' : 'Failed to create IPO');
      }
  
      // Show success notification and effects
      triggerConfetti();
      showNotification('success', isEdit ? 'IPO updated successfully! 🎉' : 'IPO added successfully! 🎉');
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
  
    } catch (error) {
      showNotification('error', error.message);
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add useEffect to pre-fill data when in edit mode
  useEffect(() => {
    if (isEdit && editData) {
      setNewIpo({
        ...newIpo,
        ...editData,
        // Ensure nested objects are properly set
        premiumGMP: editData.premiumGMP || {
          percentage: '',
          value: ''
        },
        valuations: editData.valuations || {
          eps: '',
          peRatio: '',
          ronw: '',
          nav: ''
        },
        financials: editData.financials || [{
          period: '',
          assets: '',
          revenue: '',
          profit: ''
        }],
        lotDetails: editData.lotDetails || {
          retail: {
            min: { lots: '', shares: '', amount: '' },
            max: { lots: '', shares: '', amount: '' }
          },
          shni: {
            min: { lots: '', shares: '', amount: '' },
            max: { lots: '', shares: '', amount: '' }
          },
          bhni: { 
            lots: '',
            shares: '',
            amount: ''
          }
        }
      });

      // Set promoters if they exist (updated to handle string array)
      if (editData.promoters) {
        // Convert each string in the array to an object with a 'name' property
        setPromoters(editData.promoters.map(name => ({ name })));
      } else {
        // Reset or set a default value if no promoters are provided
        setPromoters([{ name: '' }]);
      }
      if (editData.leadManagers) {
        setLeadManagers(editData.leadManagers);
      }
    }
  }, [isEdit, editData]);
console.log("inside")
  const steps = [
    { 
      number: 1, 
      title: "Basic Info", 
      icon: DocumentTextIcon,
      description: "Company name and basic details" 
    },
    { 
      number: 2, 
      title: "GMP Details", 
      icon: CurrencyDollarIcon,
      description: "Grey Market Premium information" 
    },
    { 
      number: 3, 
      title: "IPO Timeline", 
      icon: CalendarIcon,
      description: "Important dates and schedule" 
    },
    { 
      number: 4, 
      title: "IPO Details", 
      icon: InformationCircleIcon,
      description: "Detailed IPO information" 
    },
    { 
      number: 5, 
      title: "Promoters", 
      icon: UserGroupIcon,
      description: "Promoter and management details" 
    },
    { 
      number: 6, 
      title: "Valuations", 
      icon: ChartBarIcon,
      description: "Financial valuations" 
    },
    { 
      number: 7, 
      title: "Lot Size", 
      icon: BuildingOfficeIcon,
      description: "Application and lot details" 
    },
    { 
      number: 8, 
      title: "Preview", 
      icon: CheckCircleIcon,
      description: "Review and submit" 
    }
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IPO Name
                </label>
                <input
                  type="text"
                  value={newIpo.ipoName}
                  onChange={(e) => setNewIpo({ ...newIpo, ipoName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  value={newIpo.ipoLogo}
                  onChange={(e) => setNewIpo({ ...newIpo, ipoLogo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Price
                </label>
                <input
                  type="number"
                  value={newIpo.startPrice}
                  onChange={(e) => setNewIpo({ ...newIpo, startPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Price
                </label>
                <input
                  type="number"
                  value={newIpo.endPrice}
                  onChange={(e) => setNewIpo({ ...newIpo, endPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Company
                </label>
                <textarea
                  // type="textarea"
                  value={newIpo.aboutCompany}
                  onChange={(e) => setNewIpo({ ...newIpo, aboutCompany: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  
                />
              </div>
            </div>
          </div>
        );

      case 2:
        const handleGmpChange = (field, value) => {
          const endPrice = newIpo.endPrice || 100; // Replace 100 with a default value or dynamic calculation if `endPrice` is undefined.
      
          let updatedGmp = { ...newIpo.premiumGMP, [field]: value };
      
          if (field === "value" && value) {
            updatedGmp.percentage = ((value / endPrice) * 100).toFixed(2);
          } else if (field === "percentage" && value) {
            updatedGmp.value = ((value / 100) * endPrice).toFixed(2);
          }
      
          setNewIpo({
            ...newIpo,
            premiumGMP: updatedGmp,
          });
        };
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">GMP Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GMP Percentage
                </label>
                <input
                  type="number"
                  value={newIpo.premiumGMP.percentage || ""}
                  onChange={(e) => handleGmpChange("percentage", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GMP Value
                </label>
                <input
                  type="number"
                  value={newIpo.premiumGMP.value || ""}
                  onChange={(e) => handleGmpChange("value", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter value"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">IPO Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Date
                </label>
                <input
  type="date"
  value={newIpo.openDate}
  onChange={(e) => handleDateChange('openDate', e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  required
/>

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Close Date
                </label>
                <input
                  type="date"
                  value={newIpo.closeDate}
                  onChange={(e) => handleDateChange('closeDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allotment Date
                </label>
                <input
                  type="date"
                  value={newIpo.allotmentDate}
                  onChange={(e) => handleDateChange('allotmentDate', e.target.value)}

                  // onChange={(e) => setNewIpo({ ...newIpo, allotmentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refunds Date
                </label>
                <input
                  type="date"
                  value={newIpo.refundsDate}
                  onChange={(e) => handleDateChange('refundsDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demat Transfer Date
                </label>
                <input
                  type="date"
                  value={newIpo.dematTransferDate}
                  onChange={(e) => handleDateChange('dematTransferDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Date
                </label>
                <input
                  type="date"
                  value={newIpo.listingDate}
                  onChange={(e) => handleDateChange('listingDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );

        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">IPO Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Face Value (₹)
                  </label>
                  <input
                    type="number"
                    value={newIpo.faceValue}
                    onChange={(e) => setNewIpo({ ...newIpo, faceValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newIpo.issuePrice}
                    onChange={(e) => setNewIpo({ ...newIpo, issuePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Size (₹ in Cr)
                  </label>
                  <input
                    type="number"
                    value={newIpo.issueSize}
                    onChange={(e) => setNewIpo({ ...newIpo, issueSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fresh Issue (₹ in Cr)
                  </label>
                  <input
                    type="number"
                    value={newIpo.freshIssue}
                    onChange={(e) => setNewIpo({ ...newIpo, freshIssue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer for Sale (₹ in Cr)
                  </label>
                  <input
                    type="number"
                    value={newIpo.offerForSale}
                    onChange={(e) => setNewIpo({ ...newIpo, offerForSale: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retail Quota (%)
                  </label>
                  <input
                    type="number"
                    value={newIpo.retailQuota}
                    onChange={(e) => setNewIpo({ ...newIpo, retailQuota: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QIB Quota (%)
                  </label>
                  <input
                    type="number"
                    value={newIpo.qibQuota}
                    onChange={(e) => setNewIpo({ ...newIpo, qibQuota: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HNI Quota (%)
                  </label>
                  <input
                    type="number"
                    value={newIpo.hniQuota}
                    onChange={(e) => setNewIpo({ ...newIpo, hniQuota: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retail Applications
                  </label>
                  <input
                    type="number"
                    value={newIpo.retailApp}
                    onChange={(e) => setNewIpo({ ...newIpo, retailApp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SHNI Applications
                  </label>
                  <input
                    type="number"
                    value={newIpo.shniApp}
                    onChange={(e) => setNewIpo({ ...newIpo, shniApp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BHNI Applications
                  </label>
                  <input
                    type="number"
                    value={newIpo.bhniApp}
                    onChange={(e) => setNewIpo({ ...newIpo, bhniApp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select 
                    value={newIpo.issueType}
                    onChange={(e) => setNewIpo({ ...newIpo, issueType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Issue Type</option>
                    <option value="book-built">Book Built</option>
                    <option value="fixed-price">Fixed Price</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing At
                  </label>
                  <input
                    type="text"
                    value={newIpo.listingAt}
                    onChange={(e) => setNewIpo({ ...newIpo, listingAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., BSE, NSE"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registrar
                  </label>
                  <input
                    type="text"
                    value={newIpo.registrar}
                    onChange={(e) => setNewIpo({ ...newIpo, registrar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DRHP PDF URL
                  </label>
                  <input
                    type="url"
                    value={newIpo.drhpUrl}
                    onChange={(e) => setNewIpo({ ...newIpo, drhpUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/drhp.pdf"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RHP PDF URL
                  </label>
                  <input
                    type="url"
                    value={newIpo.rhpUrl}
                    onChange={(e) => setNewIpo({ ...newIpo, rhpUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/drhp.pdf"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anchor Investor URL
                  </label>
                  <input
                    type="url"
                    value={newIpo.anchorList}
                    onChange={(e) => setNewIpo({ ...newIpo, anchorList: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/anchor_investor.pdf"
                  />
                </div>
              </div>
            </div>
          );
  
          case 5:
            return (
              <div className="space-y-8">
                <PromotersSection 
                  promoters={promoters} 
                  setPromoters={setPromoters} 
                />
                <div className="border-t pt-8">
                  <LeadManagersSection 
                    leadManagers={leadManagers}
                    setLeadManagers={setLeadManagers}
                  />
                </div>
              </div>
            );
          
        case 6:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Valuations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Earning Per Share (EPS) (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIpo.valuations.eps}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      valuations: { ...newIpo.valuations, eps: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price/Earning (P/E) Ratio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIpo.valuations.peRatio}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      valuations: { ...newIpo.valuations, peRatio: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return on Networth (RoNW) (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIpo.valuations.ronw}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      valuations: { ...newIpo.valuations, ronw: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Net Asset Value (NAV) (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIpo.valuations.nav}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      valuations: { ...newIpo.valuations, nav: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Company Financials Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Company Financials</h4>
                  <button
                    type="button"
                    onClick={() => setNewIpo({
                      ...newIpo,
                      financials: [...newIpo.financials, { period: '', assets: '', revenue: '', profit: '' }]
                    })}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Entry
                  </button>
                </div>
                
                <div className="space-y-4">
                  {newIpo.financials.map((financial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                        <input
                          type="date"
                          value={financial.period}
                          onChange={(e) => {
                            const newFinancials = [...newIpo.financials];
                            newFinancials[index].period = e.target.value;
                            setNewIpo({ ...newIpo, financials: newFinancials });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assets (₹ Cr)</label>
                        <input
                          type="number"
                          value={financial.assets}
                          onChange={(e) => {
                            const newFinancials = [...newIpo.financials];
                            newFinancials[index].assets = e.target.value;
                            setNewIpo({ ...newIpo, financials: newFinancials });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (₹ Cr)</label>
                        <input
                          type="number"
                          value={financial.revenue}
                          onChange={(e) => {
                            const newFinancials = [...newIpo.financials];
                            newFinancials[index].revenue = e.target.value;
                            setNewIpo({ ...newIpo, financials: newFinancials });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profit (₹ Cr)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={financial.profit}
                            onChange={(e) => {
                              const newFinancials = [...newIpo.financials];
                              newFinancials[index].profit = e.target.value;
                              setNewIpo({ ...newIpo, financials: newFinancials });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {newIpo.financials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newFinancials = newIpo.financials.filter((_, i) => i !== index);
                                setNewIpo({ ...newIpo, financials: newFinancials });
                              }}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
      
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Lot Size Details</h3>
            
            {/* Retail Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-700">Retail</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Minimum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Lots</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.min.lots}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          min: { ...newIpo.lotDetails.retail.min, lots: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Shares</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.min.shares}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          min: { ...newIpo.lotDetails.retail.min, shares: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.min.amount}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          min: { ...newIpo.lotDetails.retail.min, amount: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Maximum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Lots</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.max.lots}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          max: { ...newIpo.lotDetails.retail.max, lots: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Shares</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.max.shares}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          max: { ...newIpo.lotDetails.retail.max, shares: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.retail.max.amount}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        retail: {
                          ...newIpo.lotDetails.retail,
                          max: { ...newIpo.lotDetails.retail.max, amount: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* S-HNI Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-700">Small HNI (S-HNI)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Minimum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Lots</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.min.lots}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          min: { ...newIpo.lotDetails.shni.min, lots: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Shares</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.min.shares}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          min: { ...newIpo.lotDetails.shni.min, shares: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.min.amount}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          min: { ...newIpo.lotDetails.shni.min, amount: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Maximum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Lots</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.max.lots}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          max: { ...newIpo.lotDetails.shni.max, lots: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Shares</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.max.shares}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          max: { ...newIpo.lotDetails.shni.max, shares: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.shni.max.amount}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        shni: {
                          ...newIpo.lotDetails.shni,
                          max: { ...newIpo.lotDetails.shni.max, amount: e.target.value }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* B-HNI Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-700">Big HNI (B-HNI)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lots</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.bhni.lots}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        bhni: { ...newIpo.lotDetails.bhni, lots: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.bhni.shares}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        bhni: { ...newIpo.lotDetails.bhni, shares: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={newIpo.lotDetails.bhni.amount}
                    onChange={(e) => setNewIpo({
                      ...newIpo,
                      lotDetails: {
                        ...newIpo.lotDetails,
                        bhni: { ...newIpo.lotDetails.bhni, amount: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 8: // Preview case
        promoters.map((promoter,index)=>console.log(promoter,index))

        return (
          <div className="space-y-8 bg-white rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4">IPO Preview</h3>
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Company Name</p>
                  <p className="font-medium">{newIpo.ipoName || '-'}</p>
                </div>
                {newIpo.ipoLogo && (
                  <div className="flex justify-end">
                    <img src={newIpo.ipoLogo} alt="Company Logo" className="h-16 w-16 object-contain" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Price Band</p>
                  <p className="font-medium">₹{newIpo.startPrice || '-'} - ₹{newIpo.endPrice || '-'}</p>
                </div>
              </div>
            </div>

            {/* GMP Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">GMP Details</h4>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">GMP Percentage</p>
                  <p className="font-medium">{newIpo.premiumGMP?.percentage || '-'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">GMP Value</p>
                  <p className="font-medium">₹{newIpo.premiumGMP?.value || '-'}</p>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">Important Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Open Date</p>
                  <p className="font-medium">{newIpo.openDate ? new Date(newIpo.openDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Close Date</p>
                  <p className="font-medium">{newIpo.closeDate ? new Date(newIpo.closeDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allotment Date</p>
                  <p className="font-medium">{newIpo.allotmentDate ? new Date(newIpo.allotmentDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Refunds Date</p>
                  <p className="font-medium">{newIpo.refundsDate ? new Date(newIpo.refundsDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Demat Transfer</p>
                  <p className="font-medium">{newIpo.dematTransferDate ? new Date(newIpo.dematTransferDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Listing Date</p>
                  <p className="font-medium">{newIpo.listingDate ? new Date(newIpo.listingDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">Issue Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Face Value</p>
                  <p className="font-medium">₹{newIpo.faceValue || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Price</p>
                  <p className="font-medium">₹{newIpo.issuePrice || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Size</p>
                  <p className="font-medium">₹{newIpo.issueSize || '-'} Cr</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lot Size</p>
                  <p className="font-medium">{newIpo.lotSize || '-'}</p>
                </div>
              </div>
            </div>

            {/* Promoter Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">Promoter Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
               
                {promoters && promoters.length > 0 ? (
                  <div className="space-y-2">
                    {promoters.map((promoter, index) => (

                      <div key={index} className="flex items-center space-x-4">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{promoter['name'] || '-'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No promoters added</p>
                )}
              </div>
            </div>

            {/* Lead Managers Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600">Lead Managers</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {leadManagers && leadManagers.length > 0 ? (
                  <div className="space-y-2">
                    {leadManagers.map((manager, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{manager.name || '-'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No lead managers added</p>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          {...confettiConfig}
          width={window.innerWidth}
          height={window.innerHeight}
          drawShape={ctx => {
            ctx.beginPath();
            for(let i = 0; i < 22; i++) {
              const angle = 0.35 * i;
              const x = (0.2 + (1.5 * angle)) * Math.cos(angle);
              const y = (0.2 + (1.5 * angle)) * Math.sin(angle);
              if(i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.fill();
            ctx.closePath();
          }}
        />
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckIcon className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  IPO Added Successfully!
                </h3>
                <p className="text-sm text-gray-500">
                  Your IPO has been added to the system
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {  notification.show  && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
  {notification.type === 'success' ? (
    <CheckIcon className="h-6 w-6 text-green-500" />
  ) : (
    <XCircleIcon className="h-6 w-6 text-red-500" />
  )}
</div>

              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                {notification.message}
                </h3>
              
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit IPO' : 'Add New IPO'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit ? 'Update the IPO information below' : 'Fill in the IPO details below'}
            </p>
          </div>
          
          {/* Step Navigation */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-8">
              {steps.map((step) => (
                <div key={step.number} className="relative group">
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center 
                      ${currentStep >= step.number 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-400'
                      } transition-all duration-300 cursor-pointer hover:bg-blue-400
                      ${currentStep === step.number ? 'ring-4 ring-blue-100' : ''}`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {step.title}
                      <br />
                      <span className="text-gray-300 text-xs">{step.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
         
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepContent(currentStep)}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2
                      ${currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                      } transition duration-300`}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                        hover:from-blue-600 hover:to-indigo-600 transition duration-300 flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onChange={handleSubmit}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg 
                        hover:from-green-600 hover:to-emerald-600 transition duration-300 flex items-center space-x-2"
                    >
                      <span>Submit IPO</span>
                      <CheckIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>
           
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LeadManagersSection = ({ leadManagers, setLeadManagers }) => {
  const handleAddManager = () => {
    setLeadManagers([...leadManagers, { name: '' }]);
  };

  const handleRemoveManager = (index) => {
    const newManagers = leadManagers.filter((_, i) => i !== index);
    setLeadManagers(newManagers);
  };

  const handleManagerChange = (index, value) => {
    const newManagers = [...leadManagers];
    newManagers[index].name = value;
    setLeadManagers(newManagers);
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Lead Managers</h3>
        <button
          type="button"
          onClick={handleAddManager}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add Lead Manager
        </button>
      </div>

      <div className="space-y-4">
        {leadManagers.map((manager, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager Name {index + 1}
              </label>
              <input
                type="text"
                value={manager.name}
                onChange={(e) => handleManagerChange(index, e.target.value)}
                placeholder="Enter lead manager name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            {leadManagers.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveManager(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AddIPO;