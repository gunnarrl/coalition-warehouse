import { useState } from 'react'
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import VendorPage from './pages/VendorPage';
import CustomerPage from './pages/CustomerPage';
import WarehousePage from './pages/WarehousePage';
import SaleOrderPage from './pages/SaleOrderPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/vendors" element={<VendorPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/warehouses" element={<WarehousePage />} />
        <Route path="/sales" element={<SaleOrderPage />} />
        <Route path="/purchases" element={<PurchaseOrderPage />} />
      </Routes>
    </Router>
  )
}

export default App
