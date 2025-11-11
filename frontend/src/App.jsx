import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "login",
          element: <Login />,
        },

        {
          path: "register",
          element: <Register />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
