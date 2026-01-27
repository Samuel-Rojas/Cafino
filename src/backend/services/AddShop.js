import { supabase } from '../utils/supabase';

/**
 * Creates a new coffee shop in the database
 * 
 * This service function handles the creation of a coffee shop entry,
 * including data validation, transformation, and error handling.
 * 
 * @param {Object} shopData - The coffee shop data to insert
 * @param {string} shopData.name - Shop name (required)
 * @param {string} [shopData.address] - Shop address (optional)
 * @param {'lots'|'moderate'|'limited'} [shopData.seating_level] - Seating availability level
 * @param {string|string[]} [shopData.vibe] - Vibe tags as comma-separated string or array
 * @param {boolean} [shopData.good_for_work] - Whether shop is good for work (defaults to false)
 * @param {string} [shopData.photo_url] - URL to shop photo (optional)
 * 
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 * Returns an object with success status, inserted data (if successful), and error message (if failed)
 * 
 * @example
 * const result = await createCoffeeShop({
 *   name: "Brew & Bean",
 *   address: "123 Main St",
 *   seating_level: "lots",
 *   vibe: "cozy, quiet, modern",
 *   good_for_work: true
 * });
 */
export async function createCoffeeShop(shopData) {
  try {
    // Validate required fields
    if (!shopData.name || shopData.name.trim() === '') {
      return {
        success: false,
        data: null,
        error: 'Shop name is required'
      };
    }

    // Prepare data for insertion
    const insertData = {
      name: shopData.name.trim(),
      address: shopData.address?.trim() || null,
      seating_level: shopData.seating_level || null,
      good_for_work: shopData.good_for_work || false,
      photo_url: shopData.photo_url?.trim() || null,
    };

    // Handle vibe tags - convert comma-separated string to array if needed
    if (shopData.vibe) {
      if (typeof shopData.vibe === 'string') {
        // Split by comma, trim each tag, filter out empty strings
        insertData.vibe = shopData.vibe
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      } else if (Array.isArray(shopData.vibe)) {
        // Already an array, just filter out empty strings
        insertData.vibe = shopData.vibe
          .map(tag => typeof tag === 'string' ? tag.trim() : tag)
          .filter(tag => tag.length > 0);
      } else {
        insertData.vibe = [];
      }
    } else {
      insertData.vibe = [];
    }

    // Validate seating_level if provided
    if (insertData.seating_level && 
        !['lots', 'moderate', 'limited'].includes(insertData.seating_level)) {
      return {
        success: false,
        data: null,
        error: 'Seating level must be one of: lots, moderate, or limited'
      };
    }

    // Insert into database
    const { data, error } = await supabase
      .from('coffee_shops')
      .insert([insertData])
      .select()
      .single(); // Returns single object instead of array

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create coffee shop'
      };
    }

    // Success!
    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error creating coffee shop:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'An unexpected error occurred'
    };
  }
}
