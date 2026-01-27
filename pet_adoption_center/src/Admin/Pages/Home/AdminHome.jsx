import AdminProfile from '../../Profile/AdminProfile'
import AdminDeleteStaff from './AdminDeleteStaff'
import AdminStaffRegister from './AdminStaffRegister'

const AdminHome = () => {
  return (
    <div>
        <AdminDeleteStaff/>
        <AdminStaffRegister/>
      <AdminProfile/>
    </div>
  )
}

export default AdminHome
