import { Outlet } from 'react-router-dom';
import StaffNavbar from '../../Components/StaffNavbar';

const StaffHome = () => {
  return (
    <div>
      <StaffNavbar />
      <Outlet />
    </div>
  );
};

export default StaffHome;
