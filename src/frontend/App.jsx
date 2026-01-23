import { useState, useEffect } from 'react';
import { supabase } from '../backend/utils/supabase';

function App() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    try {
      // Try to fetch coffee shops
      const { data, error } = await supabase
        .from('coffee_shops')
        .select('*');
      
      if (error) throw error;
      
      console.log('Connected! Data:', data);
      setShops(data);
    } catch (error) {
      console.error('Connection error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Coffee Tracker</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Connected to Supabase! Found {shops.length} coffee shops.</p>
      )}
    </div>
  );
}

export default App;