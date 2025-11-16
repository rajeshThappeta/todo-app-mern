import React from 'react'
import CreateTask from './CreateTask'
import TasksList from './TasksList'

function UserProfile() {
  return (
    <div className='row'>
      <div className="col-sm-5  border-end border-3">
        <CreateTask />
      </div>
      <div className="col-sm-7 tasks-scroll">
        <TasksList />
      </div>
    </div>
  )
}

export default UserProfile