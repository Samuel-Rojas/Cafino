import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addOrder } from '../../backend/services/AddOrder';

function AddOrder() {
  const navigate = useNavigate();
  const { shopId } = useParams(); // Get shop ID from URL

  // Form state
  const [formData, setFormData] = useState({
    shop_id: shopId || '',
    coffee_name: '',
    strength_level: '',
    price: '',
    rating: '',
    tasting_notes: '',
    photo_url: '',
    date_tried: new Date().toISOString().split('T')[0] // Default to today
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Handle input changes for all form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
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
   * Handle star rating click
   */
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));

    if (validationErrors.rating) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.coffee_name.trim()) {
      errors.coffee_name = 'Coffee name is required';
    }

    if (formData.strength_level && 
        !['light', 'medium', 'dark'].includes(formData.strength_level)) {
      errors.strength_level = 'Please select a valid strength level';
    }

    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)) {
      errors.price = 'Price must be a positive number';
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
      // Call backend service to create coffee order
      const result = await addOrder(formData);

      if (result.success) {
        // Success! Navigate back to shop detail page
        setTimeout(() => {
          navigate(`/shop/${shopId}`);
        }, 500);
      } else {
        // Handle error from service
        setError(result.error || 'Failed to create coffee order');
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
      {/* Back Button */}
      <button
        onClick={() => navigate(`/shop/${shopId}`)}
        className="mb-6 flex items-center gap-2 text-amber-800/80 hover:text-amber-900 transition-colors duration-200 group font-medium"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
        <span>Back to Shop</span>
      </button>

      {/* Header */}
      <div className="mb-10 animate-slide-in">
        <h1 className="text-5xl font-bold text-amber-900 mb-3 tracking-tight">
          Add Coffee Order
        </h1>
        <p className="text-amber-800/70 text-lg font-medium">
          Track your coffee experience at this shop
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-200/60 animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Coffee Name - Required */}
          <div>
            <label
              htmlFor="coffee_name"
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Coffee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="coffee_name"
              name="coffee_name"
              value={formData.coffee_name}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-xl border ${
                validationErrors.coffee_name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-amber-300 focus:border-amber-500 focus:ring-amber-500'
              } focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="e.g., Vanilla Latte, Espresso, Cold Brew"
              disabled={loading}
            />
            {validationErrors.coffee_name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.coffee_name}</p>
            )}
          </div>

          {/* Rating - Star Picker */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-3">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`text-3xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                    formData.rating >= star ? 'text-yellow-400' : 'text-amber-200 hover:text-yellow-300'
                  }`}
                  disabled={loading}
                >
                  ★
                </button>
              ))}
              {formData.rating && (
                <span className="ml-3 text-amber-800/80 font-medium">
                  {formData.rating}/5
                </span>
              )}
              {formData.rating && (
                <button
                  type="button"
                  onClick={() => handleRatingClick('')}
                  className="ml-2 text-sm text-amber-600 hover:text-amber-800 underline"
                  disabled={loading}
                >
                  Clear
                </button>
              )}
            </div>
            {validationErrors.rating && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.rating}</p>
            )}
          </div>

          {/* Strength Level */}
          <div>
            <label
              htmlFor="strength_level"
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Roast Level
            </label>
            <select
              id="strength_level"
              name="strength_level"
              value={formData.strength_level}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200 bg-white"
              disabled={loading}
            >
              <option value="">Select roast level</option>
              <option value="light">Light Roast</option>
              <option value="medium">Medium Roast</option>
              <option value="dark">Dark Roast</option>
            </select>
            {validationErrors.strength_level && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.strength_level}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 font-medium">
                $
              </span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200"
                placeholder="0.00"
                disabled={loading}
              />
            </div>
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
            )}
          </div>

          {/* Date Tried */}
          <div>
            <label
              htmlFor="date_tried"
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Date Tried
            </label>
            <input
              type="date"
              id="date_tried"
              name="date_tried"
              value={formData.date_tried}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200"
              disabled={loading}
            />
          </div>

          {/* Tasting Notes */}
          <div>
            <label
              htmlFor="tasting_notes"
              className="block text-sm font-semibold text-amber-900 mb-2"
            >
              Tasting Notes
            </label>
            <textarea
              id="tasting_notes"
              name="tasting_notes"
              value={formData.tasting_notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200 resize-none"
              placeholder="Describe the flavor profile, aroma, body... e.g., Smooth and creamy with hints of vanilla"
              disabled={loading}
            />
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
              placeholder="https://example.com/coffee-photo.jpg"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-amber-700/70 font-medium">
              Optional: Add a link to a photo of your coffee
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/shop/${shopId}`)}
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
                'Add Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrder;
