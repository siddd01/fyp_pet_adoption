import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import Login from "./Pages/Login/Login";
import OTPVerification from "./Pages/Login/OTPVerification"; // import the OTP page
import OTPVerificationReset from "./Pages/Login/OTPVerificationReset ";
import ResetPassword from "./Pages/Login/ResetPassword";
import Signup from "./Pages/Login/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<OTPVerification />} /> {/* new route */}
        <Route path="/otp-verification-reset" element={<OTPVerificationReset />} /> {/* new route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
