import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Shared/NavBar";
import Footer from "./Components/Shared/Footer";

import ProductsPage from "./Components/Products/Products";
import ProductDetailsPage from "./Components/Products/ProductDetails";

import CartPage from "./Components/Shared/Cart";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/Shared/ProtectedRoute";

import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminPhones from "./Components/Admin/AdminProducts";
import AdminCategories from "./Components/Admin/AdminCategories";
import AdminDeliveryAreas from "./Components/Admin/AdminDeliveryAreas";
import AdminUsers from "./Components/Admin/AdminUsers";
import AdminOrders from "./Components/Admin/AdminOrders";

import FinalizeOrder from "./Components/Products/FinalizeOrder";
import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/Shared/ScrollToTop";
import AdminGallery from "./Components/Admin/AdminGallery";
import ContactPage from "./Pages/Contact.tsx";
import AdminSellRequests from "./Components/Admin/AdminSellRequests";
import AdminContactMessages from "./Components/Admin/AdminContactMessages.jsx";
import AdminRepairRequests from "./Components/Admin/AdminRepairRequests.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Aurora background — fixed, behind everything */}
      <div className="nv-aurora-bg">
        <div className="nv-aurora-a" />
        <div className="nv-aurora-b" />
        <div className="nv-aurora-c" />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% -10%,rgba(255,255,255,.05),transparent 55%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<FinalizeOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sell-us-something" element={<ContactPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminPhones />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/delivery-areas" element={<AdminDeliveryAreas />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/sell-requests" element={<AdminSellRequests />} />
              <Route path="/admin/contacts" element={<AdminContactMessages />} />
              <Route path="/admin/repair-requests" element={<AdminRepairRequests />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
