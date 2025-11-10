import { useEffect } from "react";
import { createContext, useState } from "react";
export const authContext = createContext();

function AuthContext({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginError, setLoginError] = useState("");

  //make login req
  const userLogin = async (userCred) => {
    let res = await fetch(
      "http://localhost:8080/user-api/login",

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCred),
        credentials: "include",
      }
    );
    if (res.status === 200) {
      let resBody = await res.json();
      console.log(resBody);
      if (resBody.success === true) {
        setCurrentUser(resBody.payload);
        setLoginStatus(true);
        setLoginError("");
      } else {
        setCurrentUser(null);
        setLoginStatus(false);
        setLoginError(resBody.message);
      }
    }
  };

  //  console.log("current user",currentUser)
  const userLogout = async () => {
    let res = await fetch("http://localhost:8080/user-api/logout", { credentials: "include" });
    let resBody = await res.json();
    if (resBody.message === "Logout success") {
      setCurrentUser(null);
      setLoginStatus(false);
      setLoginError("");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/refresh", { credentials: "include" })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Not logged in");
        }
      })
      .then((user) => {
        console.log("user :", user);
        if (user.payload) {
          setCurrentUser(user.payload);
          setLoginStatus(true);
          setLoginError(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
        setLoginStatus(false);
        setLoginError(null);
      });
  }, []);
  return (
    <authContext.Provider
      value={{ currentUser, setCurrentUser, userLogin, userLogout, loginStatus, loginError }}
    >
      {children}
    </authContext.Provider>
  );
}

export default AuthContext;
