import { useContext } from "react";
import { useForm } from "react-hook-form";
import { authContext } from "../contexts/AuthContext";

function CreateTask() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let { currentUser, loginStatus, setCurrentUser } = useContext(authContext);


  const createTask = async (newTask) => {
    if (loginStatus === true) {
      let res = await fetch(`http://localhost:8080/user-api/todo/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
        credentials:"include"
      });

     
      if (res.status === 200) {
        let resBody = await res.json();
        setCurrentUser(resBody.payload);
      }
    } else {
      console.log("error or Login to continue");
    }
  };

  return (
    <>
      <h1 className="fs-3 text-center my-4 mb-3 heading">Add new Task</h1>
      <div className="p-3 mx-auto" style={{ width: "100%", maxWidth: "400px" }}>
        <form className="w-100" onSubmit={handleSubmit(createTask)}>
          <input
            type="text"
            {...register("taskName")}
            className="form-control mb-3"
            placeholder="Name of the task"
          />
          <input
            type="text"
            {...register("description")}
            className="form-control mb-3"
            placeholder="Description of the task"
          />

          <button className="btn user-register-btn" type="submit">
            Add new Task
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateTask;
