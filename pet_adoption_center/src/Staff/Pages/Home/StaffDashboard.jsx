import { useContext } from "react"
import { StaffContext } from "../../../Context/StaffContext"

const StaffDashboard = () => {
    const {staff} =useContext(StaffContext)
  return (
    <div>
      this is staff dashbaord and my name is 
      <p>{staff?.name}</p>
    </div>
  )
}

export default StaffDashboard
