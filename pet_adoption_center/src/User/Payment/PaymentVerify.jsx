import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../../Context/CartContext.jsx";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  const hasVerified = useRef(false); // prevent double API call

  const pidx = searchParams.get("pidx");

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      if (!pidx) {
        setStatus("error");
        return;
      }

      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/payment/verify",
          { pidx }
        );

        console.log("Verification response:", data);

        if (data.success) {
          await clearCart();
          setStatus("success");
          
        } else {
          console.error("Verification failed reason:", data.message);
          setStatus("error");
        }
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response?.data || err.message
        );
        setStatus("error");
      }
    };

    verifyPayment();
  }, [pidx, clearCart]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-4xl shadow-sm border border-stone-100 max-w-md w-full text-center">

        {/* 🔄 Verifying */}
        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 text-stone-900 animate-spin mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Verifying Payment</h2>
            <p className="text-stone-400 text-sm">
              Please do not refresh or close this page.
            </p>
          </>
        )}

        {/* ✅ Success */}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Payment Successful</h2>
            <p className="text-stone-400 text-sm">
              Thank you for supporting Sano Ghar! Redirecting you home...
            </p>
          </>
        )}

        {/* ❌ Error */}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Payment Failed</h2>
            <p className="text-stone-400 text-sm mb-6">
              Something went wrong with the transaction.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold"
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentVerify;