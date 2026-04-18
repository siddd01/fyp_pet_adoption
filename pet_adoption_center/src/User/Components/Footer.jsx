import { AlertTriangle, Heart, ShieldCheck } from "lucide-react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-stone-100 px-4 sm:px-6 lg:px-10 py-12 md:py-14 text-stone-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-stone-900 tracking-tight">
            Sano Ghar
          </h3>
          <p className="text-sm leading-relaxed text-stone-500">
            Nepal&apos;s compassionate community for pet adoption. We bridge the
            gap between homeless animals and loving forever homes, one paw at a
            time.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Verified Non-Profit Organization</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-stone-900">
            Community Support
          </h3>
          <p className="text-sm text-stone-500 mb-5">
            See an animal in distress or facing a technical problem? Let us know
            immediately.
          </p>
          <button
            onClick={() => navigate("/report-issue")}
            className="w-full sm:w-auto px-7 py-3 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            Report Issue
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-stone-900">
            Get in Touch
          </h3>

          <div className="flex items-center gap-3 mb-3 text-sm group">
            <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition-colors">
              <FaPhoneAlt className="text-stone-400" />
            </div>
            <p className="font-medium">+977 9717277812</p>
          </div>

          <div className="flex items-center gap-3 mb-3 text-sm group">
            <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition-colors">
              <FaEnvelope className="text-stone-400" />
            </div>
            <p className="font-medium">contact@sanoghar.com</p>
          </div>

          <a
            href="https://maps.app.goo.gl/XNur1DNsonDL9JjG9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 hover:text-stone-900 transition-colors text-sm group mt-4"
          >
            <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition-colors">
              <FaMapMarkerAlt className="text-stone-400" />
            </div>
            <p className="leading-tight">
              <span className="font-medium block">Headquarters</span>
              Herald College Kathmandu, Naxal
            </p>
          </a>
        </div>

        <div className="flex flex-col">
          <h3 className="font-semibold text-lg mb-4 text-stone-900">
            Connect With Us
          </h3>
          <div className="flex gap-4 text-xl mb-8">
            <FaInstagram className="cursor-pointer hover:text-stone-900 transition-colors" />
            <FaFacebook className="cursor-pointer hover:text-stone-900 transition-colors" />
            <FaTwitter className="cursor-pointer hover:text-stone-900 transition-colors" />
          </div>

          <div className="mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Official Partners
            </p>
            <div className="flex gap-4 items-center opacity-60 grayscale">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgmuCZ4GkFsYzzOQKrN7GPCEsqdKJXXaHNA&s"
                alt="WWF"
                className="h-6"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQR5tArNmCxirNX0d9eJSZpwfJq7emt7U7Hg&s"
                alt="HSI"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Ifaw_logo.png"
                alt="IFAW"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 max-w-7xl mx-auto mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[13px] text-stone-400">
        <p>
          &copy; {new Date().getFullYear()} Sano Ghar Pet Adoption Center. All
          rights reserved.
        </p>
        <p className="flex items-center justify-center gap-1">
          Made with{" "}
          <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the
          animals of Nepal.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
