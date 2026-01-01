import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#40565E] text-white px-6 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* SOCIAL MEDIA */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Find us on Social Media
          </h3>
          <div className="flex gap-4 text-2xl">
            <FaInstagram className="cursor-pointer hover:text-gray-300" />
            <FaFacebook className="cursor-pointer hover:text-gray-300" />
            <FaTwitter className="cursor-pointer hover:text-gray-300" />
          </div>
        </div>

        {/* AFFILIATIONS */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Affiliated With
          </h3>
          <div className="flex gap-4 items-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgmuCZ4GkFsYzzOQKrN7GPCEsqdKJXXaHNA&s" alt="WWF" className="h-8" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQR5tArNmCxirNX0d9eJSZpwfJq7emt7U7Hg&s" alt="HSI" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Ifaw_logo.png" alt="IFAW" className="h-8" />
          </div>
        </div>

        {/* CHARITY TRANSPARENCY */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Charity Transparency
          </h3>
          <div className="bg-[#32444B] p-3 rounded text-sm">
            <p className="mb-1">
              💖 <span className="font-semibold">Abcd Shrestha</span>
            </p>
            <p>
              Donated <span className="font-semibold">Rs. 5,000</span> to support our furry friends.
            </p>
          </div>
          <p className="text-xs mt-2 text-gray-300">
            20% of store profits are donated to animal charities.
          </p>
        </div>

        {/* CONTACT & LOCATION */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Emergency & Location
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <FaPhoneAlt />
            <p>+977 9717277812</p>
          </div>

          <a
            href="https://maps.google.com/?q=Herald College Kathmandu Naxal Nepal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-300"
          >
            <FaMapMarkerAlt />
            <p>Herald College Kathmandu, Naxal</p>
          </a>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-400 mt-8 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Sano Ghar Pet Adoption Center. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
