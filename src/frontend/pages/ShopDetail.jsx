import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../backend/utils/supabase';

function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop data
  useEffect(() => {
    fetchShop();
  }, [id]);

  // Fetch coffee orders for this shop
  useEffect(() => {
    if (shop) {
      fetchOrders();
    }
  }, [shop]);

  async function fetchShop() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('coffee_shops')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Coffee shop not found');
        return;
      }

      setShop(data);
    } catch (error) {
      console.error('Error fetching shop:', error);
      setError(error.message || 'Failed to load coffee shop');
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      setOrdersLoading(true);

      const { data, error } = await supabase
        .from('coffee_entries')
        .select('*')
        .eq('shop_id', id)
        .order('date_tried', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Don't set error state here, just log it
      // Orders are optional, so we don't want to break the page
    } finally {
      setOrdersLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-700 mb-4"></div>
        <p className="text-amber-800/70 text-lg font-medium">Loading coffee shop...</p>
      </div>
    );
  }

  // Error state
  if (error || !shop) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            {error || 'Coffee shop not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-amber-700 text-white rounded-2xl font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-amber-800/80 hover:text-amber-900 transition-colors duration-200 group font-medium"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
        <span className="font-medium">Back to Shops</span>
      </button>

      {/* Shop Info Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-amber-200/60 animate-scale-in">
        {/* Shop Name */}
        <h1 className="text-5xl font-bold text-amber-900 mb-4 tracking-tight">
          {shop.name}
        </h1>

        {/* Address */}
        {shop.address && (
          <div className="flex items-start gap-3 mb-6">
            <span className="text-amber-600 text-xl mt-0.5">📍</span>
            <p className="text-amber-800/80 text-lg leading-relaxed font-medium">
              {shop.address}
            </p>
          </div>
        )}

        {/* Photo */}
        {shop.photo_url && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={shop.photo_url} 
              alt={shop.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Good for Work */}
          {shop.good_for_work && (
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <span className="text-2xl">💻</span>
              <div>
                <p className="font-semibold text-purple-900">Good for Work</p>
                <p className="text-sm text-purple-700">Perfect for studying or remote work</p>
              </div>
            </div>
          )}

          {/* Seating Level */}
          {shop.seating_level && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-2xl">🪑</span>
              <div>
                <p className="font-semibold text-blue-900 capitalize">Seating: {shop.seating_level}</p>
                <p className="text-sm text-blue-700">
                  {shop.seating_level === 'lots' && 'Plenty of space available'}
                  {shop.seating_level === 'moderate' && 'Moderate seating options'}
                  {shop.seating_level === 'limited' && 'Limited seating available'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vibe Tags */}
        {shop.vibe && shop.vibe.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">
              Vibe
            </h3>
            <div className="flex flex-wrap gap-2">
              {shop.vibe.map((v, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-amber-100 text-amber-900 text-sm font-medium rounded-full capitalize shadow-sm"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coffee Orders Section */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-2 tracking-tight">
            Coffee Orders
          </h2>
          <p className="text-amber-800/70 font-medium">
            {ordersLoading ? 'Loading orders...' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} tracked`}
          </p>
        </div>

        {/* Orders Loading State */}
        {ordersLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-200 border-t-amber-700 mb-4"></div>
            <p className="text-amber-800/70 font-medium">Loading orders...</p>
          </div>
        )}

        {/* No Orders State */}
        {!ordersLoading && orders.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-12 text-center border border-amber-200/60">
            <div className="text-5xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-amber-800/70 font-medium">
              Start tracking your coffee experiences at this shop!
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!ordersLoading && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-amber-200/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              >
                {/* Coffee Name */}
                <h3 className="text-xl font-bold text-amber-900 mb-3">
                  {order.coffee_name}
                </h3>

                {/* Rating */}
                {order.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < order.rating ? 'text-yellow-400' : 'text-amber-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-amber-800/80 ml-2 font-medium">
                      {order.rating}/5
                    </span>
                  </div>
                )}

                {/* Strength Level */}
                {order.strength_level && (
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full capitalize">
                      {order.strength_level} roast
                    </span>
                  </div>
                )}

                {/* Price */}
                {order.price && (
                  <p className="text-amber-900 font-semibold mb-3">
                    ${parseFloat(order.price).toFixed(2)}
                  </p>
                )}

                {/* Tasting Notes */}
                {order.tasting_notes && (
                  <p className="text-amber-800/80 text-sm mb-3 leading-relaxed font-medium">
                    {order.tasting_notes}
                  </p>
                )}

                {/* Date */}
                {order.date_tried && (
                  <p className="text-xs text-amber-700/60 mt-4 pt-3 border-t border-amber-200/50 font-medium">
                    Tried on {new Date(order.date_tried).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}

                {/* Photo */}
                {order.photo_url && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img 
                      src={order.photo_url} 
                      alt={order.coffee_name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopDetail;
