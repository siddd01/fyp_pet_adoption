import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  return adminToken ? children : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
