import { Routes, Route, Link, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerifyEmail from "./pages/ResendVerifyEmail";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductsList from "./pages/admin/ProductsList";
import AdminProductEdit from "./pages/admin/ProductEdit";
import AdminOrdersList from "./pages/admin/OrdersList";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminCustomersList from "./pages/admin/CustomersList";
import AdminCustomerDetail from "./pages/admin/CustomerDetail";
import AdminCategories from "./pages/admin/Categories";
import AdminDiscounts from "./pages/admin/Discounts";
import AdminShipping from "./pages/admin/Shipping";
import AdminPayments from "./pages/admin/Payments";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminUsersRoles from "./pages/admin/UsersRoles";

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Panel */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsList />} />
            <Route path="products/:id" element={<AdminProductEdit />} />
            <Route path="orders" element={<AdminOrdersList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<AdminCustomersList />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsersRoles />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/resend-verification"
          element={<ResendVerifyEmail />}
        />

        <Route
          path="*"
          element={
            <main className="page">
              <h1>404 — Page not found</h1>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppShell />;
}
