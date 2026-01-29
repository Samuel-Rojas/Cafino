
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AddShop from './pages/AddShop'
import AddOrder from './pages/AddOrder'
import ShopDetail from './pages/ShopDetail'

  

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/20">
      <nav className="frosted-glass text-white p-5 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex gap-6 items-center">
          <Link to="/" className="hover:text-amber-100 font-semibold text-xl tracking-tight transition-colors duration-200 text-white">
            ☕ Cafino
          </Link>
          <div className="flex gap-6 ml-auto">
            <Link to="/" className="hover:text-amber-100 transition-colors duration-200 font-medium text-white/90">
              My Shops
            </Link>
            <Link to="/add-shop" className="hover:text-amber-100 transition-colors duration-200 font-medium text-white/90">
              Add Shop
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-shop" element={<AddShop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/shop/:shopId/add-order" element={<AddOrder />} />
        </Routes>
      </div>
    </div>
  )
};

export default App;