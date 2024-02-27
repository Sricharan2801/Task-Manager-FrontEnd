import React, { useState } from 'react'
import styles from "./deleteTask.module.css"
import { deleteTask } from '../../../API/tasks'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'


const DeleteTaskModel = ({ taskId, taskDetails, setTaskDetails }) => {


    const { setIsDeleteModel } = useAuth()

    const toggleModal = async (input) => {
        if (input === "cancel") {
            setIsDeleteModel(false)
        }
        if (input === "delete") {
            try {
                const response = await deleteTask(taskId)
                if(response.success === true){
                    toast(response.message)
                    const updatedTasks = taskDetails.filter(task => task._id != taskId);
                    setTaskDetails(updatedTasks)
                }
            } catch (error) {
                toast("Error in deleting Task")
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
