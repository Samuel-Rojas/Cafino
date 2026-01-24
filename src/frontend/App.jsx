
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AddShop from './pages/AddShop'

  

function App() {
  return (
    <div className="min-h-screen bg-coffee-50">
      <nav className="bg-coffee-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex gap-6">
          <Link to="/" className="hover:text-coffee-300 font-semibold">
            My Shops
          </Link>
          <Link to="/add-shop" className="hover:text-coffee-300">
            Add Shop
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-shop" element={<AddShop />} />
          {/* We'll add shop detail route later */}
          {/* <Route path="/shop/:id" element={<ShopDetail />} /> */}
        </Routes>
      </div>
    </div>
  )
};

export default App;