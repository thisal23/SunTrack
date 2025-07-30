import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import apiService from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import AddTypeCard from "./AddTypeCard";
import AddBrandCard from "./AddBrandCard";
import AddModelCard from "./AddModelCard";
import { Modal } from "antd";

// Constants
const VEHICLE_TYPES = [
  "Bike",
  "Three-Wheel", 
  "Car",
  "Van",
  "Cab",
  "Lorry",
  "Bus",
  "Other",
];

const FUEL_TYPES = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric" },
  { value: "Hybrid", label: "Hybrid" },
];

const INSURANCE_TYPES = [
  { value: "Third Party", label: "Third Party Insurance" },
  { value: "Full", label: "Full Insurance" },
];

const VEHICLE_CATEGORIES = [
  { value: "Heavy", label: "Heavy" },
  { value: "Light", label: "Light" },
];

const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";

// Initial form state
const INITIAL_FORM_STATE = {
  plate_no: "",
  vehicle_type: "",
  category: "",
  vehicle_model: "",
  vehicle_brand: "",
  fuel_type: "",
  register_year: "",
  chassie_number: "",
  vehicle_color: "",
  license_id: "",
  license_last_date: "",
  license_expire_date: "",
  license_document: null,
  insurance_id: "",
  insurance_last_update: "",
  insurance_expire_date: "",
  insurance_type: "",
  insurance_document: null,
  eco_id: "",
  eco_last_update: "",
  eco_expire_date: "",
  eco_document: null,
  device_id: "",
  country_code: "+94",
  sim_no: "",
};

// Custom hooks
const usePageStyles = () => {
  useEffect(() => {
    const styleId = "addnewvehicle-root-override";
    const existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        body.addnewvehicle-page #root {
          max-width: none !important;
        }
        
        /* Custom dropdown styling */
        .custom-dropdown {
          position: relative;
          display: inline-block;
          width: 100%;
        }
        
        .custom-dropdown-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .custom-dropdown-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .custom-dropdown-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 6px 6px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          width: 100%;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        /* WebKit scrollbar styling */
        .custom-dropdown-options::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-dropdown-options::-webkit-scrollbar-track {
          background: #f7fafc;
        }
        
        .custom-dropdown-options::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        
        .custom-dropdown-options::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        
        .custom-dropdown-options.show {
          display: block;
        }
        
        .custom-dropdown-option {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .custom-dropdown-option:hover {
          background-color: #f3f4f6;
        }
        
        .custom-dropdown-option.selected {
          background-color: #3b82f6;
          color: white;
        }
        
        /* Smaller button styling - more specific to override other CSS */
        .addnewvehicle-page .small-add-button,
        .addnewvehicle-page button.small-add-button {
          padding: 4px 8px !important;
          font-size: 12px !important;
          min-width: 24px !important;
          width: auto !important;
          max-width: 32px !important;
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-top: 1px !important;
        }
        
        /* Hide file input text */
        input[type="file"]::file-selector-button {
          display: none;
        }
        
        input[type="file"]::-webkit-file-upload-button {
          display: none;
        }
        
        input[type="file"]::-moz-file-upload-button {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.classList.add("addnewvehicle-page");

    return () => {
      document.body.classList.remove("addnewvehicle-page");
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
};

const useVehicleData = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching vehicle data...');
      
      const brandResponse = await apiService.get("brand/all");
      console.log('Brand response:', brandResponse);

      if (brandResponse.status === 200) {
        const brandData = brandResponse.data.data || [];
        console.log('Brands data:', brandData);
        setBrands(brandData);
      } else {
        throw new Error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setError("Failed to load vehicle data");
      toast.error("Data fetching error!");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModelsByBrand = useCallback(async (brandId) => {
    if (!brandId) {
      setModels([]);
      return;
    }
    
    try {
      console.log('Fetching models for brand:', brandId);
      const modelResponse = await apiService.get(`model/brand/${brandId}`);
      console.log('Model response:', modelResponse);

      if (modelResponse.status === 200) {
        const modelData = modelResponse.data.data || [];
        console.log('Models data for brand:', modelData);
        setModels(modelData);
      } else {
        throw new Error("Failed to fetch models");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    }
  }, []);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  return { brands, models, loading, error, refetchData: fetchVehicleData, fetchModelsByBrand };
};

// Form validation - Updated to include required documents
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.plate_no.trim()) {
    errors.plate_no = "Plate number is required";
  }
  
  if (!formData.vehicle_type) {
    errors.vehicle_type = "Vehicle type is required";
  }
  
  if (!formData.vehicle_brand) {
    errors.vehicle_brand = "Vehicle brand is required";
  }
  
  if (!formData.vehicle_model) {
    errors.vehicle_model = "Vehicle model is required";
  }
  
  if (formData.register_year && (formData.register_year < 1900 || formData.register_year > new Date().getFullYear())) {
    errors.register_year = "Please enter a valid year";
  }

  // Required documents validation
  if (!formData.license_document) {
    errors.license_document = "License document is required";
  }
  
  if (!formData.insurance_document) {
    errors.insurance_document = "Insurance document is required";
  }
  
  if (!formData.eco_document) {
    errors.eco_document = "ECO document is required";
  }

  return errors;
};

// Custom Dropdown Component
const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div
        className={`custom-dropdown-select ${disabled ? 'opacity-50 cursor-not-allowed' : ''} hover:border-gray-400 transition-colors`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200">
          <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      
      {isOpen && (
        <div className="custom-dropdown-options show">
          {/* All Options */}
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-dropdown-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
          
          {/* No options message */}
          {options.length === 0 && (
            <div className="custom-dropdown-option text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component
const AddNewVehicle = () => {
  usePageStyles();
  
  const { brands, models, loading, refetchData, fetchModelsByBrand } = useVehicleData();
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [modals, setModals] = useState({
    type: false,
    brand: false,
    model: false,
  });

  // Modal handlers
  const openModal = useCallback((modalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  }, []);

  const closeModal = useCallback((modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  }, []);

  // Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    
    // Debug file inputs
    if (type === "file") {
      console.log(`=== FILE INPUT DEBUG ===`);
      console.log(`File input "${name}" changed:`);
      console.log('Files array:', files);
      console.log('First file:', files[0]);
      if (files[0]) {
        console.log('File details:', {
          name: files[0].name,
          type: files[0].type,
          size: files[0].size,
          lastModified: files[0].lastModified
        });
      }
      console.log(`=== END FILE INPUT DEBUG ===`);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Reset model when brand changes and fetch models for the selected brand
    if (name === "vehicle_brand") {
      setFormData(prev => ({
        ...prev,
        vehicle_model: "",
      }));
      // Fetch models for the selected brand
      fetchModelsByBrand(value);
    }
  }, [formErrors, fetchModelsByBrand]);

  const createFormData = useCallback((data) => {
    const fData = new FormData();
    
    // Debug: Log the form data before creating FormData
    console.log('Form data before creating FormData:', {
      license_document: data.license_document,
      insurance_document: data.insurance_document,
      eco_document: data.eco_document
    });
    
    // Vehicle basic info
    fData.append("plateNo", data.plate_no);
    fData.append("vehicleType", data.vehicle_type);
    fData.append("category", data.category);
    fData.append("modelId", data.vehicle_model);
    fData.append("brandId", data.vehicle_brand);
    fData.append("fuelType", data.fuel_type);
    fData.append("registeredYear", data.register_year);
    fData.append("chassieNo", data.chassie_number);
    fData.append("color", data.vehicle_color);

    // License
    fData.append("licenseId", data.license_id);
    fData.append("licenseLastUpdate", data.license_last_date);
    fData.append("licenseExpireDate", data.license_expire_date);
    if (data.license_document) {
      console.log('Adding license document:', data.license_document);
      fData.append("licenseDocument", data.license_document);
    } else {
      console.log('No license document found');
    }

    // Insurance
    fData.append("insuranceNo", data.insurance_id);
    fData.append("insuranceLastUpdate", data.insurance_last_update);
    fData.append("insuranceExpireDate", data.insurance_expire_date);
    fData.append("insuranceType", data.insurance_type);
    if (data.insurance_document) {
      console.log('Adding insurance document:', data.insurance_document);
      fData.append("insuranceDocument", data.insurance_document);
    } else {
      console.log('No insurance document found');
    }

    // ECO
    fData.append("ecoId", data.eco_id);
    fData.append("ecoLastUpdate", data.eco_last_update);
    fData.append("ecoExpireDate", data.eco_expire_date);
    if (data.eco_document) {
      console.log('Adding ECO document:', data.eco_document);
      fData.append("ecoDocument", data.eco_document);
    } else {
      console.log('No ECO document found');
    }

    // GPS
    fData.append("deviceId", data.device_id);
    fData.append("countrycode", data.country_code);
    fData.append("pnumber", data.sim_no);

    return fData;
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    // Debug: Check if files are present
    console.log('Files in form data:');
    console.log('License document:', formData.license_document);
    console.log('Insurance document:', formData.insurance_document);
    console.log('ECO document:', formData.eco_document);
    
    const errors = validateForm(formData);
    console.log('Validation errors:', errors);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the validation errors");
      console.log('Form submission blocked due to validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const fData = createFormData(formData);
      
      // Debug: Log FormData contents
      console.log('=== FORMDATA DEBUG ===');
      console.log('FormData entries:');
      for (let [key, value] of fData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size,
            lastModified: value.lastModified
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log('=== END FORMDATA DEBUG ===');
      
      const response = await apiService.post("vehicle/create", fData);

      if (response.status === 201) {
        toast.success("Vehicle created successfully!");
        setFormData(INITIAL_FORM_STATE);
        setFormErrors({});
      } else {
        throw new Error("Failed to create vehicle");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to create vehicle");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, createFormData]);

  const handleModalSuccess = useCallback((modalType, newItem) => {
    if (modalType === 'brand') {
      setFormData(prev => ({
        ...prev,
        vehicle_brand: newItem.id,
        vehicle_model: "", // Reset model when brand changes
      }));
      // Fetch models for the newly created brand
      fetchModelsByBrand(newItem.id);
    } else if (modalType === 'model') {
      setFormData(prev => ({
        ...prev,
        vehicle_model: newItem.id,
      }));
    }
    
    refetchData();
    closeModal(modalType);
  }, [refetchData, closeModal, fetchModelsByBrand]);

  const handleClearAll = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
    toast.success("Form cleared successfully!");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading vehicle data...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <NavBar />
      
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
                <p className="mt-2 text-gray-600">Register a new vehicle in the system</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vehicle Details Section */}
            <fieldset className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <legend className="text-xl font-bold px-4 text-gray-800 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span>Vehicle Details</span>
                </div>
              </legend>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    Vehicle Plate Number *
                  </label>
                  <input
                    type="text"
                    name="plate_no"
                    value={formData.plate_no}
                    onChange={handleInputChange}
                    className={`block w-full py-3 px-4 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors ${
                      formErrors.plate_no ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter plate number"
                  />
                  {formErrors.plate_no && (
                    <span className="text-red-500 text-sm">{formErrors.plate_no}</span>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Vehicle Type *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomDropdown
                        options={VEHICLE_TYPES.map(type => ({ value: type, label: type }))}
                        value={formData.vehicle_type}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            vehicle_type: value,
                          }));
                        }}
                        placeholder="Select vehicle type"
                        className={formErrors.vehicle_type ? 'border-red-500' : ''}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openModal('type')}
                      className="mt-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium small-add-button flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                  {formErrors.vehicle_type && (
                    <span className="text-red-500 text-sm">{formErrors.vehicle_type}</span>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Vehicle Brand *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomDropdown
                        options={brands.map(brand => ({ value: brand.id, label: brand.brand }))}
                        value={formData.vehicle_brand}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            vehicle_brand: value,
                            vehicle_model: "", // Reset model when brand changes
                          }));
                          // Fetch models for the selected brand
                          fetchModelsByBrand(value);
                        }}
                        placeholder="Select vehicle brand"
                        disabled={loading}
                        className={formErrors.vehicle_brand ? 'border-red-500' : ''}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openModal('brand')}
                      className="mt-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium small-add-button flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                  {formErrors.vehicle_brand && (
                    <span className="text-red-500 text-sm">{formErrors.vehicle_brand}</span>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Vehicle Model *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomDropdown
                        options={models.map(model => ({ value: model.id, label: model.model }))}
                        value={formData.vehicle_model}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            vehicle_model: value,
                          }));
                        }}
                        placeholder="Select vehicle model"
                        disabled={!formData.vehicle_brand || loading}
                        className={formErrors.vehicle_model ? 'border-red-500' : ''}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openModal('model')}
                      className="mt-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium small-add-button flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                  {formErrors.vehicle_model && (
                    <span className="text-red-500 text-sm">{formErrors.vehicle_model}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Fuel Type
                    </label>
                    <CustomDropdown
                      options={FUEL_TYPES}
                      value={formData.fuel_type}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          fuel_type: value,
                        }));
                      }}
                      placeholder="Select fuel type"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Category
                    </label>
                    <CustomDropdown
                      options={VEHICLE_CATEGORIES}
                      value={formData.category}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          category: value,
                        }));
                      }}
                      placeholder="Select category"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Vehicle Color
                    </label>
                    <input
                      type="text"
                      name="vehicle_color"
                      value={formData.vehicle_color}
                      onChange={handleInputChange}
                      className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      placeholder="e.g., White"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Registered Year
                    </label>
                    <input
                      type="number"
                      name="register_year"
                      value={formData.register_year}
                      onChange={handleInputChange}
                      className={`block w-full py-2 px-3 mt-1 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none ${
                        formErrors.register_year ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    {formErrors.register_year && (
                      <span className="text-red-500 text-sm">{formErrors.register_year}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Chassis Number
                  </label>
                  <input
                    type="text"
                    name="chassie_number"
                    value={formData.chassie_number}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter chassis number"
                  />
                </div>
              </div>
            </fieldset>

            {/* Vehicle Document Info Section */}
            <fieldset className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <legend className="text-xl font-bold px-4 text-gray-800 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span>Vehicle Document Info</span>
                </div>
              </legend>

              <div className="space-y-4">
                {/* License Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-green-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>License Information</span>
                  </h4>
                  
                  <div>
                    <label className="block font-medium text-gray-700">
                      License ID
                    </label>
                    <input
                      type="text"
                      name="license_id"
                      value={formData.license_id}
                      onChange={handleInputChange}
                      className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700">
                        License Last Update
                      </label>
                      <input
                        type="date"
                        name="license_last_date"
                        value={formData.license_last_date}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700">
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        name="license_expire_date"
                        value={formData.license_expire_date}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Upload License Document *
                      <small className="text-gray-500"> (.pdf, .jpg, .jpeg, .png)</small>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="license_document"
                        onChange={handleInputChange}
                        accept={ACCEPTED_FILE_TYPES}
                        className={`block w-full py-3 px-4 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer file:hidden ${
                          formErrors.license_document ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    {formData.license_document && (
                      <div className="mt-1 text-sm text-green-600">
                        ✓ Selected: {formData.license_document.name}
                      </div>
                    )}
                    {formErrors.license_document && (
                      <span className="text-red-500 text-sm">{formErrors.license_document}</span>
                    )}
                  </div>
                </div>

                {/* Insurance Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Insurance Information</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700">
                        Insurance ID
                      </label>
                      <input
                        type="text"
                        name="insurance_id"
                        value={formData.insurance_id}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">
                        Insurance Type
                      </label>
                      <CustomDropdown
                        options={INSURANCE_TYPES}
                        value={formData.insurance_type}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            insurance_type: value,
                          }));
                        }}
                        placeholder="Select insurance type"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700">
                        Insurance Last Update
                      </label>
                      <input
                        type="date"
                        name="insurance_last_update"
                        value={formData.insurance_last_update}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">
                        Insurance Expiry Date
                      </label>
                      <input
                        type="date"
                        name="insurance_expire_date"
                        value={formData.insurance_expire_date}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Upload Insurance Document *
                      <small className="text-gray-500"> (.pdf, .jpg, .jpeg, .png)</small>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="insurance_document"
                        onChange={handleInputChange}
                        accept={ACCEPTED_FILE_TYPES}
                        className={`block w-full py-3 px-4 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer file:hidden ${
                          formErrors.insurance_document ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    {formData.insurance_document && (
                      <div className="mt-1 text-sm text-green-600">
                        ✓ Selected: {formData.insurance_document.name}
                      </div>
                    )}
                    {formErrors.insurance_document && (
                      <span className="text-red-500 text-sm">{formErrors.insurance_document}</span>
                    )}
                    {formErrors.insurance_document && (
                      <span className="text-red-500 text-sm">{formErrors.insurance_document}</span>
                    )}
                  </div>
                </div>

                {/* ECO Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-purple-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Emission Test Information</span>
                  </h4>
                  
                  <div>
                    <label className="block font-medium text-gray-700">
                      ECO ID
                    </label>
                    <input
                      type="text"
                      name="eco_id"
                      value={formData.eco_id}
                      onChange={handleInputChange}
                      className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700">
                        Emission Test Last Update
                      </label>
                      <input
                        type="date"
                        name="eco_last_update"
                        value={formData.eco_last_update}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">
                        Emission Test Expiry Date
                      </label>
                      <input
                        type="date"
                        name="eco_expire_date"
                        value={formData.eco_expire_date}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">
                      Upload ECO Document *
                      <small className="text-gray-500"> (.pdf, .jpg, .jpeg, .png)</small>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="eco_document"
                        onChange={handleInputChange}
                        accept={ACCEPTED_FILE_TYPES}
                        className={`block w-full py-3 px-4 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer file:hidden ${
                          formErrors.eco_document ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    {formData.eco_document && (
                      <div className="mt-1 text-sm text-green-600">
                        ✓ Selected: {formData.eco_document.name}
                      </div>
                    )}
                    {formErrors.eco_document && (
                      <span className="text-red-500 text-sm">{formErrors.eco_document}</span>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* GPS Device Data Section */}
            <fieldset className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <legend className="text-xl font-bold px-4 text-gray-800 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>GPS Device Data</span>
                </div>
              </legend>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    GPS Device ID
                  </label>
                  <input
                    type="text"
                    name="device_id"
                    value={formData.device_id}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter device ID"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Country Code
                  </label>
                  <input
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="e.g.LK"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Device SIM Number
                  </label>
                  <input
                    type="text"
                    name="sim_no"
                    value={formData.sim_no}
                    onChange={handleInputChange}
                    className="block w-full py-2 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter SIM number"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          
          <div className="flex justify-between pt-8 gap-6">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-8 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 bg-red-500 hover:bg-red-600 text-white transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All</span>
              </div>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Vehicle'
              )}
            </button>
          </div>
        </form>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={modals.type}
        onCancel={() => closeModal('type')}
        footer={null}
        title="Add Vehicle Type"
      >
        <AddTypeCard
          isOpen={modals.type}
          onClose={() => closeModal('type')}
        />
      </Modal>

      <Modal
        open={modals.brand}
        onCancel={() => closeModal('brand')}
        footer={null}
        title="Add Vehicle Brand"
      >
        <AddBrandCard
          isOpen={modals.brand}
          onClose={() => closeModal('brand')}
          onSuccess={(newBrand) => handleModalSuccess('brand', newBrand)}
        />
      </Modal>

      <Modal
        open={modals.model}
        onCancel={() => closeModal('model')}
        footer={null}
        title="Add Vehicle Model"
      >
        <AddModelCard
          isOpen={modals.model}
          onClose={() => closeModal('model')}
          onSuccess={(newModel) => handleModalSuccess('model', newModel)}
          selectedBrandId={formData.vehicle_brand}
        />
      </Modal>
    </>
  );
};

export default AddNewVehicle;