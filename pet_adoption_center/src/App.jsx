import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


// Pages
import { AuthContext } from "./Context/AuthContext.jsx";
import AboutUs from "./User/Pages/AboutUs/AboutUs";
import Adopt from "./User/Pages/Adopt/Adopt";
import AdoptionForm from "./User/Pages/Adopt/AdoptionForm.jsx";
import PetDetails from "./User/Pages/Details/PetDetails";
import ProductDetails from "./User/Pages/Details/ProductDetails";
import Donate from "./User/Pages/Donate/Donate";
import Dashboard from "./User/Pages/Home/Dashboard";
import Home from "./User/Pages/Home/Home";

import AdminLogin from "./Admin/Pages/Login/AdminLogin.jsx";
import AdminRegister from "./Admin/Pages/Login/AdminRegister.jsx";
import ForgotPassword from "./User/Pages/Login/ForgotPassword";
import Login from "./User/Pages/Login/Login";
import OTPVerification from "./User/Pages/Login/OTPVerification";
import OTPVerificationReset from "./User/Pages/Login/OTPVerificationReset";
import ResetPassword from "./User/Pages/Login/ResetPassword";
import Cart from "./User/Pages/Shop/Cart";
import Shop from "./User/Pages/Shop/Shop";
import Profile from "./User/Profile/Profile";

// --------- Protected Route Component ---------
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // Show spinner or placeholder while fetching user

  return user ? children : <Navigate to="/login" />;
};

// --------- App Component ---------
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-Login" element={<AdminLogin />} />
        <Route path="/admin-Signup" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/otp-verification-reset" element={<OTPVerificationReset/>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="adopt" element={<Adopt />} />
          <Route path="adopt/:id" element={<PetDetails />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetails />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="donate" element={<Donate />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="adopt-form/:id" element={<AdoptionForm />} />
        </Route>

        {/* Catch-all redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
