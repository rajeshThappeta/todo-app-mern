import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { authContext } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let { userLogin, loginStatus, loginError } = useContext(authContext);
  let navigate = useNavigate();

  const onFormSubmit = (userCred) => {
    userLogin(userCred);
  };

  useEffect(() => {
    if (loginStatus === true) {
     // toast.success("Login successful! Taking to Profile.");
      navigate("/profile");
    } else {
    }
  }, [loginStatus]);

  return (
    <>
      {loginError?.length !== 0 && <p className="text-center fs-4 text-danger">{loginError}</p>}
      <h1 className="fs-3 text-center my-4 heading">User SignIn</h1>
      <div className="p-3 mx-auto register-wrapper" style={{ width: "100%", maxWidth: "400px" }}>
        <form className="w-100" onSubmit={handleSubmit(onFormSubmit)}>
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
            Login
          </button>
        </form>
        <p className="lead fs-6 mt-3 text-center">
          Not Registered yet ?{" "}
          <NavLink
            to="/register"
            className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light fst-italic"
          >
            Register
          </NavLink>
        </p>
      </div>
    </>
  );
}

export default Login;
