import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  let [registerErr,setRegisterErr]=useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate();

  const createUser = async (newUser) => {
    console.log(newUser);
    let res = await fetch("http://localhost:8080/user-api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

   // console.log(res);
    if (res.status === 201) {
      setRegisterErr("")
      toast.success("Registration successful! Please login.");
      navigate("/login"); // Navigate immediately
    } else {
      const errorData = await res.json();
      console.log("error data",errorData)
      toast.error(errorData.message || "Registration failed");
      setRegisterErr(errorData.message)
    }
  };

  return (
    <>
    { registerErr.length!==0 && <p className="text-center fs-4 text-danger">{registerErr}</p>}
      <h1 className="fs-3 text-center my-4 mb-3 heading">User SignUp</h1>
      <div className="p-3 mx-auto register-wrapper" style={{ width: "100%", maxWidth: "400px" }}>
        <form className="w-100" onSubmit={handleSubmit(createUser)}>
          <div className="mb-3">
            <input
              type="text"
              {...register("name", { required: true })}
              className="form-control "
              placeholder="Name"
            />
            {/* name validation error messages */}
            {errors.name?.type === "required" && <p className="text-danger form-validation-err">*Name is Required</p>}
          </div>

          <div className="mb-3">
            <input
              type="email"
              {...register("email", { required: true })}
              className="form-control"
              placeholder="Email"
            />
            {/* email validation error messages */}
            {errors.email?.type === "required" && <p className="text-danger form-validation-err">*Email is Required</p>}
          </div>

          <div className="mb-3">
            <input
              type="password"
              {...register("password", { required: true })}
              className="form-control"
              placeholder="Password"
            />
            {/* name validation error messages */}
            {errors.password?.type === "required" && (
              <p className="text-danger form-validation-err">*Password is Required</p>
            )}
          </div>

          <button className="btn user-register-btn" type="submit">
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
