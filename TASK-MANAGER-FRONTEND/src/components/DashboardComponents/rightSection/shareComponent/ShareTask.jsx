import React, { useState, useEffect } from 'react'
import styles from "./shareTask.module.scss"
import { getTaskById } from '../../../../API/tasks'
import { getBacklogTask } from '../../../../API/backlogTasks'
import { getInprogressTask } from '../../../../API/inProgressTask'
import { getDoneTask } from '../../../../API/doneTasks'
import { useParams } from 'react-router-dom'
import codesandbox from "../../../../assets/icons/codesandbox.png"
import highPriorityIcon from "../../../../assets/icons/highPriorityIcon.png"
import moderatePriorityIcon from "../../../../assets/icons/moderatePriorityIcon.png"
import lowPriorityIcon from "../../../../assets/icons/lowPriorityIcon.png"
import { format, parse } from 'date-fns'
import { useAuth } from '../../../../contexts/AuthContext'

const ShareTask = () => {
    const { taskId } = useParams()
    const [taskDetails, setTaskDetails] = useState()
    console.log(taskDetails);
    const [priorityIcon, setPriorityIcon] = useState("")
    const [selectedCheckList, setSelectedCheckList] = useState(0)
    const [totalCheckLists, setTotalCheckLists] = useState(0)
    

   const isTodo = localStorage.getItem("isTodo")
   const isBacklog= localStorage.getItem("isBacklog")
   const isInProgress = localStorage.getItem("isInProgress")
   const isDone = localStorage.getItem("isDone")


    useEffect(() => {
        if (taskDetails && taskDetails.selectPriority) {
            if (taskDetails.selectPriority === "HIGH PRIORITY") {
                setPriorityIcon(highPriorityIcon)
            }
            if (taskDetails.selectPriority === "MODERATE PRIORITY") {
                setPriorityIcon(moderatePriorityIcon)
            }
            if (taskDetails.selectPriority === "LOW PRIORITY") {
                setPriorityIcon(lowPriorityIcon)
            }
        }

        if (taskDetails && taskDetails.taskList) {
            const totalTasks = taskDetails.taskList.length
            setTotalCheckLists(totalTasks)
        }

        if (taskDetails && taskDetails.checkList) {
            const selectedTasks = taskDetails.checkList.filter(task => task === true)
            setSelectedCheckList(selectedTasks.length)
        }
        

    }, [taskDetails])

    useEffect(() => {
        fetchTaskDetails()
    }, [taskId])

    const fetchTaskDetails = async () => {
        if (isTodo === "true") {
            try {
                const response = await getTaskById(taskId)
                setTaskDetails(response.taskDetails)
            } catch (error) {
                console.log("error", error);
            }
        }
        if(isBacklog === "true"){
            try {
                const response = await getBacklogTask(taskId)
                setTaskDetails(response.tasks)
            } catch (error) {
                console.log("error", error);
            }
        }
        if(isInProgress === "true"){
            try {
                const response = await getInprogressTask(taskId)
                setTaskDetails(response.tasks)
            } catch (error) {
                console.log("error", error);
            }
        }
        if(isDone === "true"){
            try {
                const response = await getDoneTask(taskId)
                setTaskDetails(response.tasks)
            } catch (error) {
                console.log("error", error);
            }
        }
    }
    return (
        <main className={styles.main}>
            <section className={styles.leftSection}>
                <div className={styles.logoAndName}>
                    <img src={codesandbox} alt="logo" className={styles.logo} />
                    <p className={styles.name}>Pro Manage</p>

                </div>
            </section>

            <section className={styles.rightSection}>
                <div className={styles.cardContainer}>

                    {
                        taskDetails ? <div className={styles.task}>

                            <div className={styles.taskDetails}>

                                {/* priority container */}
                                <div className={styles.priorityContainer}>
                                    <img src={priorityIcon ? priorityIcon : ""} alt="" className={styles.priorityIcon} />
                                    <p className={styles.priorityType}>{taskDetails ? taskDetails.selectPriority : ""}</p>
                                </div>

                                {/* title */}
                                <p className={styles.title}>{taskDetails ? taskDetails.title : ""}</p>

                                <div className={styles.checkListContainer}>
                                    <p className={styles.heading}>Checklist ({selectedCheckList}/{totalCheckLists})</p>

                                    {
                                        taskDetails &&
                                        taskDetails.checkList.map((isChecked, index) => {
                                            return <div className={styles.taskListContainer}>
                                                <input type="checkbox"
                                                    className={styles.checkBox}
                                                    checked={isChecked}
                                                    readOnly
                                                />

                                                <input type="text"
                                                    className={styles.inputField}
                                                    value={taskDetails.taskList[index]}
                                                    readOnly
                                                />
                                            </div>
                                        })
                                    }
                                </div>

                                {
                                    taskDetails && taskDetails.dueDate ?
                                        <div className={styles.dueDateContainer}>
                                            <p className={styles.text}>Due Date</p>

                                            <div className={styles.dueDate}>
                                                {taskDetails.dueDate ?
                                                    format(parse(taskDetails.dueDate, 'dd/MM/yyyy', new Date()), 'MMM do')
                                                    : " "}
                                            </div>

                                        </div>
                                        :
                                        <div className={styles.empty}></div>
                                }

                            </div>

                        </div>
                            : <></>
                    }

                </div>
            </section>

        </main>
    )
}

export default ShareTask
