import { BrowserRouter, Route, Routes } from "react-router-dom";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Adopt from "./Pages/adopt/adopt";
import Donate from "./Pages/Donate/Donate";
import Dashboard from "./Pages/Home/Dashboard";
import Home from "./Pages/Home/Home";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import Login from "./Pages/Login/Login";
import OTPVerification from "./Pages/Login/OTPVerification"; // import the OTP page
import OTPVerificationReset from "./Pages/Login/OTPVerificationReset ";
import ResetPassword from "./Pages/Login/ResetPassword";
import Shop from "./Pages/Shop/Shop";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/adopt" element={<Adopt />} />
          {/* later */}
           <Route path="/shop" element={<Shop />} />
           <Route path="/about" element={<AboutUs />} />
           <Route path="/donate" element={<Donate />} />
        </Route>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
  
        
        <Route path="/otp-verification" element={<OTPVerification />} /> {/* new route */}
        <Route path="/otp-verification-reset" element={<OTPVerificationReset />} /> {/* new route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
