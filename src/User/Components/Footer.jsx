import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white">
      {/* yellow accent line */}
      <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="md:col-span-1">
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-3">Sano Ghar</p>
            <p className="text-stone-400 text-sm leading-relaxed mb-5">
              A safe home for every rescued soul. Rescuing, rehoming, and caring since day one.
            </p>
            <div className="flex gap-3">
              {[FaInstagram, FaFacebook, FaTwitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 hover:bg-stone-700 hover:border-stone-500 flex items-center justify-center text-stone-400 hover:text-white transition"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Affiliated With ── */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">Affiliated With</p>
            <div className="flex flex-wrap gap-3 items-center">
              {[
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgmuCZ4GkFsYzzOQKrN7GPCEsqdKJXXaHNA&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQR5tArNmCxirNX0d9eJSZpwfJq7emt7U7Hg&s",
                "https://upload.wikimedia.org/wikipedia/commons/0/0b/Ifaw_logo.png",
              ].map((src, i) => (
                <div key={i} className="bg-white/10 border border-stone-700 rounded-lg p-2">
                  <img src={src} alt="Affiliation" className="h-6 object-contain opacity-80" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Charity Transparency ── */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">Charity Transparency</p>
            <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 text-sm mb-3">
              <p className="text-white font-medium mb-1">💖 Abcd Shrestha</p>
              <p className="text-stone-400 text-xs leading-relaxed">
                Donated <span className="text-white font-semibold">Rs. 5,000</span> to support our furry friends.
              </p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              20% of store profits are donated to animal charities.
            </p>
          </div>

          {/* ── Contact & Location ── */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">Emergency & Location</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3">
                <FaPhoneAlt size={13} className="text-stone-400 flex-shrink-0" />
                <p className="text-sm text-stone-300">+977 9717277812</p>
              </div>
              <a
                href="https://maps.google.com/?q=Herald College Kathmandu Naxal Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 hover:border-stone-500 hover:bg-stone-700 transition group"
              >
                <FaMapMarkerAlt size={13} className="text-stone-400 flex-shrink-0" />
                <p className="text-sm text-stone-300 group-hover:text-white transition">
                  Herald College Kathmandu, Naxal
                </p>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Sano Ghar Pet Adoption Center. All rights reserved.
          </p>
          <p className="text-xs text-stone-600">Made with 🐾 for rescued animals</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;