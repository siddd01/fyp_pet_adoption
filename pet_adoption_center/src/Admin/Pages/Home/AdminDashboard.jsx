import {
    ClipboardList,
    HeartHandshake,
    PawPrint,
    ShoppingBag,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Add Staff Management",
      desc: "Add staff members",
      icon: <Users size={32} />,
      link: "/admin/staff/add",
      color: "bg-blue-100 text-blue-600",
    },    {
      title: "Remove Staff ",
      desc: "Remove staff members",
      icon: <Users size={32} />,
      link: "/admin/staff/delete",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pet Management",
      desc: "Add, edit and manage pets",
      icon: <PawPrint size={32} />,
      link: "/admin/pets",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Adoption Requests",
      desc: "Approve or reject adoption requests",
      icon: <ClipboardList size={32} />,
      link: "/admin/adoptions",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Store Management",
      desc: "Manage products and orders",
      icon: <ShoppingBag size={32} />,
      link: "/admin/store",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Store Management Add",
      desc: "Manage products and orders",
      icon: <ShoppingBag size={32} />,
      link: "store/add-product",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Charity & Donations",
      desc: "Track and post charity updates",
      icon: <HeartHandshake size={32} />,
      link: "/admin/charity",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full ${card.color} mb-4`}
            >
              {card.icon}
            </div>
            <h2 className="text-lg font-semibold mb-1">
              {card.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
