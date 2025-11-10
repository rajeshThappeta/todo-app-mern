import {useContext, useEffect} from 'react'
import { useForm } from "react-hook-form";
import { authContext } from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom'

function Login() {
     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      let {userLogin,loginStatus}=useContext(authContext)
      let navigate=useNavigate()


      const onFormSubmit=(userCred)=>{
        userLogin(userCred)
      }

      useEffect(()=>{
        if(loginStatus===true){
          navigate("/profile")
        }
      },[loginStatus])

      console.log(loginStatus)
  return (
      <>
    <h1 className="fs-3 text-center my-4 heading">User SignIn</h1>
    <div className="p-3 mx-auto register-wrapper" style={{ width: "100%", maxWidth: "400px" }}>
      <form className="w-100" onSubmit={handleSubmit(onFormSubmit)}>
       
        <input
          type="email"
          {...register("email")}
          className="form-control mb-3"
          placeholder="Email"
        />
        <input
          type="password"
          {...register("password")}
          className="form-control mb-3"
          placeholder="Password"
        />
        <button className="btn user-register-btn" type="submit">
          Login
        </button>
      </form>
    </div>
    </>
  )
}

export default Login