import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PetLoader from "../../Components/PetLoader.jsx";
import { AdminAuthContext } from "../../Context/AdminAuthContext.jsx";

const AdminPrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, AdminProfileLoading } = useContext(AdminAuthContext);

  if (loading || AdminProfileLoading) {
    return <PetLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
