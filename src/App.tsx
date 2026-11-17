import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LocationProvider } from './contexts/LocationContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ExploreMap } from './pages/ExploreMap';
import { Search } from './pages/Search';
import { StoreDetail } from './pages/StoreDetail';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Favorites } from './pages/Favorites';
import { Plus } from './pages/Plus';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { Help } from './pages/Help';
import { Terms, Privacy } from './pages/Terms';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/map" element={<ExploreMap />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/store/:id" element={<StoreDetail />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Cart />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/plus" element={<Plus />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
              <BottomNav />
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
