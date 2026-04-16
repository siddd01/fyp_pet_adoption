import axios from "axios";
import { Heart, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DonationVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  const pidx = searchParams.get("pidx");

  useEffect(() => {
    // Prevent double-calling in React Strict Mode
    if (hasVerified.current) return;
    
    const verify = async () => {
      if (!pidx) {
        setStatus("error");
        return;
      }

      hasVerified.current = true;

      try {
        // We send the pidx to the backend to confirm with Khalti
        const { data } = await axios.post("/api/charity/verify", { pidx });
        
        if (data.success) {
          setStatus("success");
          // Redirect to home after a short delay so they see the "Thank You"
          setTimeout(() => {
            navigate("/");
          }, 2000); 
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Donation verification failed:", err);
        setStatus("error");
      }
    };

    verify();
  }, [pidx, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-4xl shadow-sm border border-stone-100 max-w-md w-full text-center">
        
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 text-stone-900 animate-spin mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Verifying Donation</h2>
            <p className="text-stone-400 text-sm">Please do not refresh or close this page.</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Thank You!</h2>
            <p className="text-stone-400 text-sm mb-2">
              Your donation was received. The rescues at Sano Ghar are grateful.
            </p>
            <p className="text-stone-300 text-xs">Redirecting you home...</p>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-2">Donation Failed</h2>
            <p className="text-stone-400 text-sm mb-6">Something went wrong during the transaction.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate("/donate")} className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold">
                Try Again
              </button>
              <button onClick={() => navigate("/")} className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl text-sm font-bold">
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationVerify;