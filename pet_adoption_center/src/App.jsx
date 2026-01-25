import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


// Pages
import { AuthContext } from "./Context/AuthContext.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Adopt from "./Pages/Adopt/Adopt";
import PetDetails from "./Pages/Details/PetDetails";
import ProductDetails from "./Pages/Details/ProductDetails";
import Donate from "./Pages/Donate/Donate";
import Dashboard from "./Pages/Home/Dashboard";
import Home from "./Pages/Home/Home";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import Login from "./Pages/Login/Login";
import OTPVerification from "./Pages/Login/OTPVerification";
import OTPVerificationReset from "./Pages/Login/OTPVerificationReset";
import ResetPassword from "./Pages/Login/ResetPassword";
import Cart from "./Pages/Shop/Cart";
import Shop from "./Pages/Shop/Shop";
import Profile from "./Profile/Profile";

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
        </Route>

        {/* Catch-all redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
