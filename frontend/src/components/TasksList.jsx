import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import Task from "./Task";

function TasksList() {
  let { currentUser, loginStatus, setCurrentUser } = useContext(authContext);

  return (
    <div className="tasks-container ">
      <h1 className="fs-3 text-center my-4 mb-3 heading heading-fixed ">List of Tasks</h1>
      {currentUser !== null && currentUser?.todos?.length !== 0 ? (
        currentUser.todos.map((taskObj) => <Task taskObj={taskObj} />)
      ) : (
        <div className="text-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-wishlist-illustration-svg-download-png-11068637.png"
            width="200px"
            alt=""
          />
          <p className="fs-6 text-center text-warning mt-4">List is Empty!</p>
        </div>
      )}
    </div>
  );
}

export default TasksList;
