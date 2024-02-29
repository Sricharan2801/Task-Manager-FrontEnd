import React, { useState } from 'react'
import styles from "./deleteTask.module.css"
import { deleteTask } from '../../../API/tasks'
import { removeBacklogTask } from '../../../API/backlogTasks'
import { removeInProgressTask } from '../../../API/inProgressTask'
import { removeDoneTask } from '../../../API/doneTasks'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'


const DeleteTaskModel = ({ taskId, taskDetails, setTaskDetails }) => {

    const { setIsDeleteModel, isTodo, isBacklog, isInProgress, isDone  } = useAuth()

    const toggleModal = async (input) => {
        if (input === "cancel") {
            setIsDeleteModel(false)
        }

        if (input === "delete") {
            try {
                let response;
                if(isTodo) response = await deleteTask(taskId)
                if(isBacklog) response = await removeBacklogTask(taskId)
                if(isInProgress) response = await removeInProgressTask(taskId)
                if(isDone) response = await removeDoneTask(taskId)

                if(response.success === true){
                    toast.success(response.message)
                    const updatedTasks = taskDetails.filter(task => task._id != taskId);
                    setTaskDetails(updatedTasks)
                }
            } catch (error) {
                toast.error("Error in deleting Task")
            }
            setIsDeleteModel(false)
        }
    };

    return (
        <>
            <div className={styles.modal}>
                <div onClick={toggleModal} className={styles.overlay}></div>
                <div className={styles.modalContent}>
                    <p className={styles.text}>Are you sure you want to Delete?</p>

                    <button className={styles.proceedBtn}
                        onClick={() => toggleModal("delete")}>
                        Yes, Delete</button>

                    <button className={styles.cancelBtn}
                        onClick={() => toggleModal("cancel")}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default DeleteTaskModel
