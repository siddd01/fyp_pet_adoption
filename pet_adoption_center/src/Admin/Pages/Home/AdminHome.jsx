import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../Components/AdminNavbar'

const AdminHome = () => {
  return (
    <div>
      <AdminNavbar/>
       <Outlet/>
    </div>
  )
}

export default AdminHome
