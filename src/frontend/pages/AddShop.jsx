import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCoffeeShop } from '../../backend/services/AddShop';

function AddShop() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    seating_level: '',
    vibe: '',
    good_for_work: false,
    photo_url: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Handle input changes for all form fields
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear general error when user makes changes
    if (error) {
      setError(null);
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Shop name is required';
    }

    if (formData.seating_level && 
        !['lots', 'moderate', 'limited'].includes(formData.seating_level)) {
      errors.seating_level = 'Please select a valid seating level';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call backend service to create coffee shop
      const result = await createCoffeeShop(formData);

      if (result.success) {
        // Success! Show brief success message then navigate
        // You could add a toast notification here if you want
        setTimeout(() => {
          navigate('/');
        }, 500); // Small delay for better UX
      } else {
        // Handle error from service
        setError(result.error || 'Failed to create coffee shop');
        setLoading(false);
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Error submitting form:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10 animate-slide-in">
        <h1 className="text-5xl font-bold text-amber-900 mb-3 tracking-tight">
          Add New Coffee Shop
        </h1>
        <p className="text-amber-800/70 text-lg font-medium">
          Share your favorite coffee spot with the community
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-200/60 animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Shop Name - Required */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-xl border ${
                validationErrors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-amber-300 focus:border-amber-500 focus:ring-amber-500'
              } focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="e.g., Brew & Bean, Coffee Corner"
              disabled={loading}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label 
              htmlFor="address" 
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200"
              placeholder="123 Main Street, City, State"
              disabled={loading}
            />
          </div>

          {/* Seating Level */}
          <div>
            <label 
              htmlFor="seating_level" 
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Seating Availability
            </label>
            <select
              id="seating_level"
              name="seating_level"
              value={formData.seating_level}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200 bg-white"
              disabled={loading}
            >
              <option value="">Select seating level</option>
              <option value="lots">Lots of seating</option>
              <option value="moderate">Moderate seating</option>
              <option value="limited">Limited seating</option>
            </select>
            {validationErrors.seating_level && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.seating_level}</p>
            )}
          </div>

          {/* Vibe Tags */}
          <div>
            <label 
              htmlFor="vibe" 
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Vibe Tags
            </label>
            <input
              type="text"
              id="vibe"
              name="vibe"
              value={formData.vibe}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200"
              placeholder="e.g., cozy, quiet, modern, artsy (comma-separated)"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-amber-700/70 font-medium">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Photo URL */}
          <div>
            <label 
              htmlFor="photo_url" 
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Photo URL
            </label>
            <input
              type="url"
              id="photo_url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200"
              placeholder="https://example.com/photo.jpg"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-amber-700/70 font-medium">
              Optional: Add a link to a photo of the shop
            </p>
          </div>

          {/* Good for Work Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="good_for_work"
              name="good_for_work"
              checked={formData.good_for_work}
              onChange={handleChange}
              className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
              disabled={loading}
            />
            <label 
              htmlFor="good_for_work" 
              className="ml-3 text-sm font-medium text-amber-900"
            >
              Good for working/studying
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3.5 border-2 border-amber-300 text-amber-800 rounded-2xl font-semibold hover:bg-amber-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-amber-700 text-white rounded-2xl font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Shop'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddShop;
