import React, { useEffect, useState } from 'react'
import styles from "./updateTask.module.css"
import { editTask } from '../../../API/tasks'
import { editBacklogTask } from '../../../API/backlogTasks'
import { editInprogressTask } from '../../../API/inProgressTask'
import { editDoneTask } from '../../../API/doneTasks'
import { useAuth } from '../../../contexts/AuthContext'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import highPriorityIcon from "../../../assets/icons/highPriorityIcon.png"
import lowPriorityIcon from "../../../assets/icons/lowPriorityIcon.png"
import moderatePriorityIcon from "../../../assets/icons/moderatePriorityIcon.png"
import deleteIcon from "../../../assets/icons/deleteIcon.png"
import toast from 'react-hot-toast'


const UpdateTaskModel = ({ taskDetails, taskId, reloadBoard, backlogTasks,
    inProgress, doneTasks }) => {
    // states for number of tasks present & no.of tasks selected
    const [totalTasks, setTotalTasks] = useState(0)
    const [selectedTasks, setSelectedTasks] = useState(0)
    // state for number of inputs
    const [taskInputs, setTaskInputs] = useState([])

    // states for all fields
    const [title, setTitle] = useState("")
    const [selectPriority, setSelectPriority] = useState("")
    const [checkList, setCheckList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [dueDate, setDueDate] = useState("")
    const [showCalendar, setShowCalendar] = useState(false)

    // to control the model
    const { setIsUpdateTaskActive, isTodo, isBacklog, isInProgress, isDone } = useAuth()
    useEffect(() => {
        let taskToUpdate;
        if (isBacklog) taskToUpdate = backlogTasks.find(task => task._id === taskId);
        if (isTodo) taskToUpdate = taskDetails.find(task => task._id === taskId);
        if (isInProgress) taskToUpdate = inProgress.find(task => task._id === taskId)
        if (isDone) taskToUpdate = doneTasks.find(task => task._id === taskId)


        if (taskToUpdate) {
            setTitle(taskToUpdate.title || "");
            setSelectPriority(taskToUpdate.selectPriority || "");
            setDueDate(taskToUpdate.dueDate || "");

            if (taskToUpdate.checkList) {
                setTotalTasks(taskToUpdate.checkList.length);
                setTaskInputs(taskToUpdate.checkList.map((_, index) => ({ id: index + 1 })));

                setCheckList(taskToUpdate.checkList);
                const selectedTasksCount = taskToUpdate.checkList.filter(item => item).length;
                setSelectedTasks(selectedTasksCount);
            }

            if (taskToUpdate.taskList) {
                setTaskList(taskToUpdate.taskList);
            }
        }
    }, [taskDetails, taskId]);


    const addTaskInput = () => {
        setTaskInputs([...taskInputs, { id: totalTasks + 1 }])
        setTaskList([...taskList, ""])
        setCheckList([...checkList, false])
        setTotalTasks(totalTasks + 1)
    }

    const removeTaskInput = (id) => {
        const taskToRemove = taskInputs.find(taskInput => taskInput.id === id);
        if (taskToRemove) {
            const index = taskInputs.findIndex(taskInput => taskInput.id === id);

            if (checkList[index]) {
                setSelectedTasks(selectedTasks - 1)
            }
            setTotalTasks(totalTasks - 1);
            setTaskInputs(taskInputs.filter(taskInput => taskInput.id !== id))
            setTaskList(taskList.filter((_, index) => index !== id))
            setCheckList(prevCheckList => {
                const updatedCheckList = [...prevCheckList];
                updatedCheckList[index] = false
                return updatedCheckList.filter((_, checkIndex) => checkIndex !== index)
            })
        }
    }

    const handleCheckboxChange = (id, checked) => {
        if (checked) {
            setSelectedTasks(selectedTasks + 1);
        } else {
            setSelectedTasks(selectedTasks - 1);
        }

        setTaskInputs(taskInputs.map(taskInput => {
            if (taskInput.id === id) {
                return { ...taskInput, selected: checked };
            }
            return taskInput;
        }));

        setCheckList(prevCheckList => {
            const updatedCheckList = [...prevCheckList];
            updatedCheckList[id] = checked;
            return updatedCheckList;
        });
    }


    const titleHandler = (e) => {
        setTitle(e.target.value)
    }

    const taskHandler = (index, value) => {
        setTaskList(prevTaskList => {
            const updatedTaskList = [...prevTaskList]
            updatedTaskList[index] = value
            return updatedTaskList
        });
    };

    const handleDueDateClick = () => {
        setShowCalendar(!showCalendar);
    }

    const handleDueDate = (date) => {
        const formattedDate = format(date, "dd/MM/yyyy")
        setDueDate(formattedDate);
        setShowCalendar(false)
    }

    const saveTask = async () => {
        try {
            const payLoad = {
                title: title, selectPriority: selectPriority,
                checkList: checkList, taskList: taskList, dueDate: dueDate
            }
            const handleSuccess = (response) => {
                if (response.data.success === true) {
                    setIsUpdateTaskActive(false)
                    reloadBoard()
                    toast.success(response.data.message)
                }
            }
            if (isTodo) {
                const response = await editTask(taskId, payLoad)
                handleSuccess(response)
            }
            if (isBacklog) {
                const response = await editBacklogTask(taskId, payLoad)
                handleSuccess(response)
            }
            if (isInProgress) {
                const response = await editInprogressTask(taskId, payLoad)
                handleSuccess(response)
            }
            if (isDone) {
                const response = await editDoneTask(taskId, payLoad)
                handleSuccess(response)
            }

        } catch (error) {
            console.log("error", error);
            if (error.response.data.errorMessage === "Bad Request") return toast("please fill mandatory fields");
            if (error.response.data.errorMessage === "Error in Updating Task") return toast("Error in creating job!!");
            if (error.response.data.errorMessage === "Internal Server Error") return toast("Internal Server Error");
        }
    }


    return (
        <>
            <div className={styles.modal}>
                <div className={styles.overlay}></div>
                <div className={styles.modalContent}>
                    <div className={styles.titleContainer}>
                        <p className={styles.fieldName}>Title <span className={styles.symbol}>*</span></p>
                        <input type="text" placeholder="Enter Task Title"
                            className={styles.taskNameField}
                            name='title'
                            value={title}
                            onChange={titleHandler} />
                    </div>

                    <div className={styles.priorityContainer}>
                        <p className={styles.fieldName}>Select Priority <span className={styles.symbol}>*</span></p>

                        <div className={styles.priorites}
                            onClick={() => setSelectPriority("HIGH PRIORITY")}
                            style={{ backgroundColor: selectPriority === "HIGH PRIORITY" ? 'rgba(238, 236, 236, 1)' : "transparent" }}
                        >
                            <img src={highPriorityIcon} alt="icon" className={styles.icon} />
                            HIGH PRIORITY
                        </div>

                        <div className={styles.priorites}
                            onClick={() => setSelectPriority("MODERATE PRIORITY")}
                            style={{ backgroundColor: selectPriority === "MODERATE PRIORITY" ? 'rgba(238, 236, 236, 1)' : "transparent" }}
                        >
                            <img src={moderatePriorityIcon} alt="icon" className={styles.icon} />
                            MODERATE PRIORITY
                        </div>


                        <div className={styles.priorites}
                            onClick={() => setSelectPriority("LOW PRIORITY")}
                            style={{ backgroundColor: selectPriority === "LOW PRIORITY" ? 'rgba(238, 236, 236, 1)' : "transparent" }}
                        >
                            <img src={lowPriorityIcon} alt="icon" className={styles.icon} />
                            LOW PRIORITY
                        </div>
                    </div>

                    <p className={styles.fieldName}>Checklist ({selectedTasks}/{totalTasks}) <span className={styles.symbol}>*</span></p>

                    <div className={styles.checkListContainer}>
                        {taskInputs.map((taskInput, index) => (
                            <div key={taskInput.id} className={styles.taskInputContainer}>
                                <input type="checkbox" className={styles.checkBox} onChange={(e) => handleCheckboxChange(index, e.target.checked)} checked={checkList[index]} />
                                <input type="text" className={styles.taskInput}
                                    placeholder='Add a task' name='taskList'
                                    value={taskList[index]}
                                    onChange={(e) => taskHandler(index, e.target.value)}
                                />
                                <img src={deleteIcon} alt="Icon" className={styles.deleteIcon} onClick={() => removeTaskInput(taskInput.id)} />
                            </div>
                        ))}

                        <button className={styles.addSkillBtn} onClick={addTaskInput}>+ Add New</button>
                    </div>

                    <div className={styles.buttonsContainer}>

                        <button className={styles.dueDateBtn} onClick={handleDueDateClick}>
                            {dueDate ? dueDate : 'Select Due Date'}
                        </button>

                        <div className={styles.btnContainer}>
                            <button className={styles.btns} id={styles.cancelBtn}
                                onClick={() => setIsUpdateTaskActive(false)}>Cancel</button>
                            <button className={styles.btns} id={styles.saveBtn} onClick={() => saveTask()}>Save</button>
                        </div>
                    </div>
                    {
                        showCalendar ? <Calendar className={styles.Calendar}
                            onChange={handleDueDate}
                            value={dueDate}
                            onClickDay={() => setShowCalendar(false)}

                        /> : <></>
                    }
                </div>
            </div>
        </>
    )
}

export default UpdateTaskModel
