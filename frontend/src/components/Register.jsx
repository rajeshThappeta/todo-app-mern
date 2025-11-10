import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate=useNavigate()

  const createUser = async (newUser) => {
    console.log(newUser)
    let res = await fetch("http://localhost:8080/user-api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    console.log(res)
    if (res.status === 201) {
      toast.success("Registration successful! Please login.");
      navigate("/login"); // Navigate immediately
    } else {
      const errorData = await res.json();
      toast.error(errorData.message || "Registration failed");
    }
  };

  return (
    <>
      <h1 className="fs-3 text-center my-4 mb-3 heading">User SignUp</h1>
      <div className="p-3 mx-auto register-wrapper" style={{ width: "100%", maxWidth: "400px" }}>
        <form className="w-100" onSubmit={handleSubmit(createUser)}>
          <input
            type="text"
            {...register("name")}
            className="form-control mb-3"
            placeholder="Name"
          />
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
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
