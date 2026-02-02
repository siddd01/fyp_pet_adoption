import {
  ClipboardList,
  PawPrint,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StaffContext } from "../../../Context/StaffContext";

const StaffDashboard = () => {
  const { staff } = useContext(StaffContext);
  
  const cards = [
    {
      title: "Add Pets",
      desc: "Add new pets to the adoption center",
      icon: <PawPrint size={32} />,
      link: "/staff/pets/add",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "View Pets",
      desc: "View and manage all pets",
      icon: <PawPrint size={32} />,
      link: "/staff/pets/view",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Delete Pets",
      desc: "Delete pets from the system",
      icon: <Trash2 size={32} />,
      link: "/staff/pets/delete",
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Adoption Requests",
      desc: "Approve or reject adoption requests",
      icon: <ClipboardList size={32} />,
      link: "/staff/adoptions",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Store Management",
      desc: "View and manage products",
      icon: <ShoppingBag size={32} />,
      link: "/staff/store/products",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Add Product",
      desc: "Add new products to the store",
      icon: <ShoppingBag size={32} />,
      link: "/staff/store/add-product",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Staff Dashboard
        </h1>
        {staff && (
          <p className="text-gray-600">
            Welcome, {staff.first_name} {staff.last_name}!
          </p>
        )}
      </div>

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

export default StaffDashboard;
