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
import AdminSellRequests from "./Components/Admin/AdminSellRequests";
import PhonesPage from "./Pages/PhonesPage";
import AccessoriesPage from "./Pages/AccessoriesPage";
import CasesPage from "./Pages/CasesPage";
import ContactPage from "./Pages/ContactPage";
import SellPage from "./Pages/SellPage";
import RepairPage from "./Pages/RepairPage";
import AdminContactMessages from "./Components/Admin/AdminContactMessages.jsx";
import AdminRepairRequests from "./Components/Admin/AdminRepairRequests.jsx";
import AdminPhoneBrands from "./Components/Admin/AdminPhoneBrands.jsx";
import AdminAccessoriesCategories from "./Components/Admin/AdminAccessoriesCategories.jsx";
import AdminAccessories from "./Components/Admin/AdminAccessories.jsx";
import AdminCases from "./Components/Admin/AdminCases.jsx";
import AccessoryDetailsPage from "./Components/Products/AccessoryDetails.jsx";
import CaseDetailsPage from "./Components/Products/CaseDetails.jsx";

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
            <Route path="/phones" element={<PhonesPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/accessory/:id" element={<AccessoryDetailsPage />} />
            <Route path="/case/:id" element={<CaseDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<FinalizeOrder />} />
            <Route path="/login" element={<Login />} />
            {/* Legacy redirect for old sell link */}
            <Route path="/sell-us-something" element={<SellPage />} />

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
              <Route path="/admin/phone-brands" element={<AdminPhoneBrands />} />
              <Route path="/admin/accessories-categories" element={<AdminAccessoriesCategories />} />
              <Route path="/admin/accessories" element={<AdminAccessories />} />
              <Route path="/admin/cases" element={<AdminCases />} />
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
