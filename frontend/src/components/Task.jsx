import React, { useContext, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { RxUpdate } from "react-icons/rx";
import { authContext } from "../contexts/AuthContext";
import { Modal } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { IoSaveOutline } from "react-icons/io5";
import { MdOutlineEditOff } from "react-icons/md";
import { useForm } from "react-hook-form";

function Task({ taskObj }) {
  let [btnStatus, setBtnStatus] = useState(false);
  let [modalStatus, setModalStatus] = useState(false);
  let { register, handleSubmit, setValue } = useForm();
  let [taskBeingEdited, setTaskBeingEdited] = useState(null);

  //modal functions
  const openModal = (taskObj) => {
    setModalStatus(true);
    setValue("taskName", taskObj.taskName);
    setValue("description", taskObj.description);
    setTaskBeingEdited(taskObj);
  };
  const closeModal = () => {
    setModalStatus(false);
  };
  let { currentUser, loginStatus, setCurrentUser } = useContext(authContext);
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

    let resBody = await res.json();
    console.log(resBody);
    setCurrentUser(resBody.payload);
  };

  const deleteTaskById = async (userId, taskId) => {
    let res = await fetch(
      ` http://localhost:8080/user-api/delete-todo?userId=${userId}&taskId=${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      }
    );
    let resBody = await res.json();
    setCurrentUser(resBody.payload);
  };

  const onEditTask = () => {};

  const onSavetask = async (modifiedTaskObj) => {
    //get updatedTaskObj by adding Object ID
    const updatedTaskObj = { ...taskBeingEdited, ...modifiedTaskObj };
    //udpate state
    setTaskBeingEdited(updatedTaskObj);
    //make API req
    let res = await fetch(
      `http://localhost:8080/user-api/edit-todo?userId=${currentUser._id}&taskId=${taskBeingEdited._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskObj),
        credentials: "include",
      }
    );
    if (res.status === 200) {
      closeModal();
      let resBody = await res.json();
      setCurrentUser(resBody.payload);
    }
  };

  return (
    <div className="bg-light m-3 p-3 task-obj-parent">
      <button
        className=" btn btn-sm btn-close d-block ms-auto"
        onClick={() => deleteTaskById(currentUser._id, taskObj._id)}
      ></button>
      <div className="task-header">
        <p className="lead mb-2 text-capitalize ">
          <span className=" rounded task-name">{taskObj.taskName}</span>
          <span className="ms-2 editon-btn fs-3">
            {taskObj.status === "pending" ? (
              <CiEdit onClick={() => openModal(taskObj)} />
            ) : (
             <MdOutlineEditOff className="editoff-btn" />
            )}
          </span>
        </p>
        <p className="small-text mb-2">
          Status :
          {taskObj.status === "pending" ? (
            <span className=" bg-warning text-white rounded px-1 ms-2">{taskObj.status}</span>
          ) : (
            <span className="bg-success text-white rounded px-1 ms-2">{taskObj.status}</span>
          )}
        </p>
      </div>
      <p className="task-desc pb-4">{taskObj.description}</p>

      {taskObj.status !== "completed" && (
        <button
          disabled={btnStatus}
          className="btn btn-sm btn-outline-success mark-as-completed-btn"
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
      {/* modal */}
      <Modal show={modalStatus} onHide={closeModal} centered size="md" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="w-100" onSubmit={handleSubmit(onSavetask)}>
            <input
              type="text"
              {...register("taskName")}
              className="form-control form-control-sm mb-3"
              placeholder="Name of the task"
            />
            <input
              type="text"
              {...register("description")}
              className="form-control form-control-sm mb-3"
              placeholder="Description of the task"
            />

            <button className="btn btn-outline-success float-end" type="submit">
              <IoSaveOutline />
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Task;
