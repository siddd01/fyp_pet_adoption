import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Context
import { AuthContext } from "./Context/AuthContext.jsx";

// User Pages
import AboutUs from "./User/Pages/AboutUs/AboutUs";
import Adopt from "./User/Pages/Adopt/Adopt";
import AdoptionForm from "./User/Pages/Adopt/AdoptionForm.jsx";
import PetDetails from "./User/Pages/Details/PetDetails";
import ProductDetails from "./User/Pages/Details/ProductDetails";
import Donate from "./User/Pages/Donate/Donate";
import Dashboard from "./User/Pages/Home/Dashboard";
import Home from "./User/Pages/Home/Home";
import ForgotPassword from "./User/Pages/Login/ForgotPassword";
import Login from "./User/Pages/Login/Login";
import OTPVerification from "./User/Pages/Login/OTPVerification";
import OTPVerificationReset from "./User/Pages/Login/OTPVerificationReset";
import ResetPassword from "./User/Pages/Login/ResetPassword";
import Cart from "./User/Pages/Shop/Cart";
import Shop from "./User/Pages/Shop/Shop";
import Profile from "./User/Profile/Profile";

// Admin Pages
import AdminDashboard from "./Admin/Pages/Home/AdminDashboard.jsx";
import AdminHome from "./Admin/Pages/Home/AdminHome.jsx";
import AdminLogin from "./Admin/Pages/Login/AdminLogin.jsx";
import AdminRegister from "./Admin/Pages/Login/AdminRegister.jsx";
import AdminDeleteStaff from "./Admin/Pages/Staff/AdminDeleteStaff.jsx";
import AdminStaffRegister from "./Admin/Pages/Staff/AdminStaffRegister.jsx";

// Staff
import StaffLogin from "./Staff/Pages/Login/StaffLogin.jsx";

// Admin Guard
import AdminHandleAdoption from "./Admin/Pages/Adoptions/AdminHandleAdoption.jsx";
import AdminAddPets from "./Admin/Pages/Pets/AdminAddPets.jsx";
import AdminDeletePets from "./Admin/Pages/Pets/AdminDeletePets.jsx";
import AdminAddProduct from "./Admin/Pages/Store/AdminAddProduct.jsx";
import AdminEditProduct from "./Admin/Pages/Store/AdminEditProduct.jsx";
import AdminProducts from "./Admin/Pages/Store/AdminProducts.jsx";
import AdminPrivateRoute from "./Admin/Routes/AdminPrivateRoute.jsx";
import Signup from "./User/Pages/Login/Signup.jsx";

// -------- User Protected Route --------
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

// -------- App --------
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* -------- Public Routes -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/otp-verification-reset" element={<OTPVerificationReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* -------- Admin Routes -------- */}
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminHome />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="staff/add" element={<AdminStaffRegister />} />
          <Route path="staff/delete" element={<AdminDeleteStaff />} />
          <Route path="store/add-product" element={<AdminAddProduct />} />
          <Route path="store/handle-product" element={<AdminProducts />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="pet/delete-pets" element={<AdminDeletePets />} />
          <Route path="pet/add-pets" element={<AdminAddPets />} />
          <Route path="pet/handle-adoptions" element={<AdminHandleAdoption />} />



        </Route>

        {/* -------- User Routes -------- */}
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
          <Route path="adopt-form/:id" element={<AdoptionForm />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetails />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="donate" element={<Donate />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        {/* -------- Fallback -------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
