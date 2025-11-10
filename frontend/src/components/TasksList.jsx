import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import { CiCalendarDate } from "react-icons/ci";
import { RxUpdate } from "react-icons/rx";
import { useState } from "react";

function TasksList() {
  let { currentUser, loginStatus, setCurrentUser } = useContext(authContext);
  let [btnStatus, setBtnStatus] = useState(false);

  function formatDate(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const setTaskCompletion = async (taskObj) => {
    console.log(taskObj);
    taskObj.status = "completed";
    let res = await fetch(
      `http://localhost:8080/user-api/todo?userId=${currentUser._id}&taskId=${taskObj._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskObj),
      }
    );
    console.log(res);
    let resBody = await res.json();
    setCurrentUser(resBody.payload);
  };

  console.log(currentUser);
  return (
    <div className="tasks-container ">
      <h1 className="fs-3 text-center my-4 mb-3 heading heading-fixed ">List of Tasks</h1>
      {currentUser !== null && currentUser?.todos?.length !== 0 ? (
        currentUser.todos.map((taskObj) => (
          <div className="bg-light m-3 p-3 task-obj-parent">
            <p className="lead mb-2 text-capitalize ">
              <span className="bg-secondary text-light rounded px-1">{taskObj.taskName}</span>
            </p>
            <p className="task-desc">{taskObj.description}</p>
            <p className="small-text mb-2">
              Status :
              {taskObj.status === "pending" ? (
                <span className=" bg-warning text-white rounded px-1 ms-2">{taskObj.status}</span>
              ) : (
                <span className="bg-success text-white rounded px-1 ms-2">{taskObj.status}</span>
              )}
            </p>
            {taskObj.status !== "completed" && (
              <button
                disabled={btnStatus}
                className="btn btn-sm btn-info mark-as-completed-btn"
                onClick={() => setTaskCompletion(taskObj)}
              >
                Mark as completed
              </button>
            )}

            <div className="timestamps">
              <p className="small-text">
                <CiCalendarDate /> :{formatDate(taskObj.createdAt)}
              </p>
              <p className="small-text">
                <RxUpdate /> :{formatDate(taskObj.updatedAt)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="display-6">No Tasks found</p>
      )}
    </div>
  );
}

export default TasksList;
