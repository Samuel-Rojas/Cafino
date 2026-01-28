import { supabase } from "../utils/supabase";

/**
 * Creates a new coffee order/entry in the database
 * 
 * This service function handles the creation of a coffee entry,
 * including data validation, transformation, and error handling.
 * 
 * @param {Object} order - The coffee order data to insert
 * @param {string} order.shop_id - The UUID of the coffee shop (required)
 * @param {string} order.coffee_name - Name of the coffee (required)
 * @param {'light'|'medium'|'dark'} [order.strength_level] - Roast level (optional)
 * @param {number} [order.price] - Price of the coffee (optional)
 * @param {number} [order.rating] - Rating from 1-5 (optional)
 * @param {string} [order.tasting_notes] - Tasting notes (optional)
 * @param {string} [order.photo_url] - URL to photo (optional)
 * @param {string} [order.date_tried] - Date tried (optional, defaults to today)
 * 
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 * 
 * @example
 * const result = await addOrder({
 *   shop_id: '123e4567-e89b-12d3-a456-426614174000',
 *   coffee_name: 'Vanilla Latte',
 *   strength_level: 'medium',
 *   price: 5.50,
 *   rating: 4,
 *   tasting_notes: 'Smooth and creamy'
 * });
 */
export async function addOrder(order) {
    try {
        // ============================================
        // VALIDATION
        // ============================================

        // Validate shop_id (required)
        if (!order.shop_id || order.shop_id.trim() === '') {
            return {
                success: false,
                data: null,
                error: 'Shop ID is required'
            };
        }

        // Validate coffee_name (required)
        if (!order.coffee_name || order.coffee_name.trim() === '') {
            return {
                success: false,
                data: null,
                error: 'Coffee name is required'
            };
        }

        // Validate strength_level if provided (must be light, medium, or dark)
        if (order.strength_level && 
            !['light', 'medium', 'dark'].includes(order.strength_level)) {
            return {
                success: false,
                data: null,
                error: 'Strength level must be one of: light, medium, or dark'
            };
        }

        // Validate rating if provided (must be 1-5)
        if (order.rating !== null && order.rating !== undefined) {
            const rating = parseInt(order.rating);
            if (isNaN(rating) || rating < 1 || rating > 5) {
                return {
                    success: false,
                    data: null,
                    error: 'Rating must be between 1 and 5'
                };
            }
        }

        // Validate price if provided (must be positive number)
        if (order.price !== null && order.price !== undefined && order.price !== '') {
            const price = parseFloat(order.price);
            if (isNaN(price) || price < 0) {
                return {
                    success: false,
                    data: null,
                    error: 'Price must be a positive number'
                };
            }
        }

        // ============================================
        // PREPARE DATA FOR INSERT
        // ============================================

        const insertData = {
            shop_id: order.shop_id.trim(),
            coffee_name: order.coffee_name.trim(),
        };

        // Add optional fields if provided
        if (order.strength_level && order.strength_level.trim() !== '') {
            insertData.strength_level = order.strength_level.trim();
        }

        if (order.price !== null && order.price !== undefined && order.price !== '') {
            insertData.price = parseFloat(order.price);
        }

        if (order.rating !== null && order.rating !== undefined && order.rating !== '') {
            insertData.rating = parseInt(order.rating);
        }

        if (order.tasting_notes && order.tasting_notes.trim() !== '') {
            insertData.tasting_notes = order.tasting_notes.trim();
        }

        if (order.photo_url && order.photo_url.trim() !== '') {
            insertData.photo_url = order.photo_url.trim();
        }

        if (order.date_tried) {
            insertData.date_tried = order.date_tried;
        }

        // ============================================
        // INSERT INTO DATABASE
        // ============================================

        const { data, error } = await supabase
            .from('coffee_entries')
            .insert([insertData])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return {
                success: false,
                data: null,
                error: error.message || 'Failed to create coffee order'
            };
        }

        // Success!
        return {
            success: true,
            data: data,
            error: null
        };

    } catch (error) {
        console.error("Unexpected error creating coffee order:", error);
        return {
            success: false,
            data: null,
            error: error.message || 'An unexpected error occurred'
        };
    }
}
