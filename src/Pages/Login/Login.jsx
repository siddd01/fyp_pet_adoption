import { useState } from 'react'

const Login = () => {
    const [accountExist,setAccountExist]=useState(false)
  return (
    
    <div>
      <div className="">
<div className="">
            <label htmlFor="">Email</label>
        <input type="email" />
</div>
<div className="">
            <label htmlFor="">Password</label>
        <input type="password" />
</div>
<div className="">
            {accountExist?
        <button>Login</button>:
        <button>
            Signup
        </button>
        }
      
</div>
      </div>
    </div>
  )
}

export default Login
