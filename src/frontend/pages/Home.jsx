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
        <p className="text-coffee-600">Loading your coffee adventures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchCoffeeShops}
          className="mt-4 px-4 py-2 bg-coffee-700 text-white rounded hover:bg-coffee-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (coffeeShops.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-coffee-900 mb-4">
          No Coffee Adventures Yet
        </h2>
        <p className="text-coffee-600">Start tracking them!! button will go here</p>
        <button onClick={() => navigate('/add-shop')} className="px-6 py-3 bg-coffee-700 text-white rounded-lg hover:bg-coffee-800">Add Your First Cup of Joe</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-coffee 900 mb-6">Cafino</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coffeeShops.map((shop) => (
          <div 
            key={shop.id}
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-coffee-300"
          >
            {/* Shop Name */}
            <h3 className="text-xl font-bold text-coffee-900 mb-2">
              {shop.name}
            </h3>
            
            {/* Address */}
            {shop.address && (
              <p className="text-coffee-600 text-sm mb-4">
                📍 {shop.address}
              </p>
            )}
            
            {/* Features/Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {shop.good_for_work && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  💻 Good for Work
                </span>
              )}
            </div>
            
            {/* Seating Level */}
            {shop.seating_level && (
              <p className="text-coffee-600 text-sm mb-2">
                <span className="font-semibold">Seating:</span> {shop.seating_level}
              </p>
            )}
            
            {/* Vibe Tags */}
            {shop.vibe && shop.vibe.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {shop.vibe.map((v, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-coffee-100 text-coffee-800 text-xs rounded capitalize"
                  >
                    {v}
                  </span>
                ))}
              </div>
            )}
            
            {/* Click hint */}
            <p className="mt-4 text-xs text-coffee-400 text-center">
              Click to view orders →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
