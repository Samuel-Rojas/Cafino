import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../backend/utils/supabase";

function Home() {
  const navigate = useNavigate();
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoffeeShops();
  }, []);

  async function fetchCoffeeShops() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("coffee_shops")
        .select('*')
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCoffeeShops(data || []);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching coffee shops:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-800/70 font-medium">Loading your coffee adventures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchCoffeeShops}
          className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-2xl hover:bg-amber-800 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (coffeeShops.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-8 animate-scale-in" style={{ animationDelay: '100ms' }}>☕</div>
          <h2 className="text-4xl font-bold text-amber-900 mb-4 tracking-tight animate-slide-in" style={{ animationDelay: '200ms' }}>
            No Coffee Adventures Yet
          </h2>
          <p className="text-amber-800/70 mb-10 text-lg animate-slide-in font-medium" style={{ animationDelay: '300ms' }}>
            Start tracking your favorite coffee shops and build your collection!
          </p>
          <button 
            onClick={() => navigate('/add-shop')} 
            className="px-8 py-4 bg-amber-700 text-white rounded-2xl font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2 mx-auto animate-scale-in"
            style={{ animationDelay: '400ms' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Your First Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-slide-in">
          <h1 className="text-5xl font-bold text-amber-900 mb-3 tracking-tight">
            My Coffee Shops
          </h1>
          <p className="text-amber-800/70 text-lg font-medium">
            {coffeeShops.length} {coffeeShops.length === 1 ? 'shop' : 'shops'} tracked
          </p>
        </div>
        <button 
          onClick={() => navigate('/add-shop')} 
          className="px-6 py-3.5 bg-amber-700 text-white rounded-2xl font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 animate-scale-in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Shop
        </button>
      </div>

      {/* Coffee Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coffeeShops.map((shop, index) => (
          <div 
            key={shop.id}
            onClick={() => navigate(`/shop/${shop.id}`)}
            style={{ animationDelay: `${index * 50}ms` }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-amber-200/60 hover:border-amber-300 group hover:-translate-y-1 animate-fade-in"
          >
            {/* Shop Name */}
            <h3 className="text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-800 transition-colors duration-200">
              {shop.name}
            </h3>
            
            {/* Address */}
            {shop.address && (
              <div className="flex items-start gap-2 mb-4">
                <span className="text-amber-600 mt-0.5 text-lg">📍</span>
                <p className="text-amber-800/80 text-sm flex-1 leading-relaxed font-medium">
                  {shop.address}
                </p>
              </div>
            )}
            
            {/* Features/Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {shop.good_for_work && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm">
                  <span>💻</span>
                  Good for Work
                </span>
              )}
              {shop.seating_level && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize shadow-sm">
                  {shop.seating_level} seating
                </span>
              )}
            </div>
            
            {/* Vibe Tags */}
            {shop.vibe && shop.vibe.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {shop.vibe.map((v, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-medium rounded-full capitalize shadow-sm"
                  >
                    {v}
                  </span>
                ))}
              </div>
            )}
            
            {/* Click hint with arrow animation */}
            <div className="mt-6 pt-4 border-t border-amber-200/50">
              <p className="text-xs text-amber-700/60 text-center group-hover:text-amber-800 transition-all duration-200 flex items-center justify-center gap-1.5 font-medium">
                <span>Click to view orders</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200 inline-block">→</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
