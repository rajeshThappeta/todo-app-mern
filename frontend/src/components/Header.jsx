import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function Header() {
  let { currentUser, loginStatus, userLogout } = useContext(authContext);
  const navigate = useNavigate();

  const onUserLogout = async () => {
    await userLogout();

    toast.info("Logged out successfully");

    navigate("/login");
  };


 // console.log("current user in header:",currentUser)

  return (
    <ul className="nav justify-content-end">
      {loginStatus !== true ? (
        <li className="nav-link">
          <NavLink
            to="login"
            className="nav-link"
            style={({ isActive }) => ({
              color: isActive ? "#069494" : "#adb5bd",
            })}
          >
            Login
          </NavLink>
        </li>
      ) : (
        <li className="nav-link">
          <NavLink
            to="login"
            className="nav-link"
            style={({ isActive }) => ({
              color: isActive ? "#069494" : "#adb5bd",
            })}
            onClick={onUserLogout}
          >
            Logout
          </NavLink>
        </li>
      )}

      <li className="nav-link">
        <NavLink
          to="register"
          className="nav-link"
          style={({ isActive }) => ({
            color: isActive ? "#069494" : "#adb5bd",
          })}
        >
          Register
        </NavLink>
      </li>
    </ul>
  );
}

export default Header;
