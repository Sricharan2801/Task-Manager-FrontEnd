import React, { useState, useEffect, useRef } from 'react';
import styles from './board.module.scss';
import { getTaskDetailsByFilter, getTaskById, deleteTask, createTask } from '../../../../API/tasks';
import { createBacklogTask, getBacklogTask, getAllBacklogTasks, removeBacklogTask } from '../../../../API/backlogTasks';
import { createInProgressTask, getAllInProgressTasks, getInprogressTask, removeInProgressTask } from '../../../../API/inProgressTask';
import { createDoneTask, getAllDoneTasks, getDoneTask, removeDoneTask } from '../../../../API/doneTasks';
import { format, parse } from 'date-fns';
import collapseIcon from '../../../../assets/icons/collapseIcon.png';
import addIcon from '../../../../assets/icons/addIcon.png';
import AddTaskModel from '../../../Model/addTask/AddTaskModel';
import DeleteTaskModel from '../../../Model/deleteTask/DeleteTaskModel';
import UpdateTaskModel from '../../../Model/updateTask/UpdateTaskModel';
import { useAuth } from '../../../../contexts/AuthContext';
import highPriorityIcon from '../../../../assets/icons/highPriorityIcon.png';
import lowPriorityIcon from '../../../../assets/icons/lowPriorityIcon.png';
import moderatePriorityIcon from '../../../../assets/icons/moderatePriorityIcon.png';
import optionsIcon from '../../../../assets/icons/optionsIcon.png';
import compressingIcon from '../../../../assets/icons/compressingIcon.png';
import expansionIcon from '../../../../assets/icons/expansionIcon.png';
import toast from 'react-hot-toast';


const Board = () => {
  const [duration, setDuration] = useState('this week')
  const [taskDetails, setTaskDetails] = useState([])
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [inProgress, setInProgress] = useState([])
  const [doneTasks, setDoneTasks] = useState([])


  const [priority, setPriority] = useState([])
  const [backlogPriority, setBackLogPriority] = useState([])
  const [inProgressPriority, setInProgressPriority] = useState([])
  const [donePriorities, setDonePriorities] = useState()

  const [isChecked, setIsChecked] = useState([])
  const [selectedCheckLists, setSelectedCheckLists] = useState([])
  const [totalCheckLists, setTotalCheckLists] = useState([])

  const [backlogIsChecked, setBacklogIsChecked] = useState([]);
  const [backlogTotalCheckLists, setBacklogTotalCheckLists] = useState(0);
  const [backLogSelected, setBackLogSelected] = useState(0)

  const [inProgressIsChecked, setInProgressIsChecked] = useState([])
  const [inProgressTotalLists, setInProgressTotalLists] = useState(0)
  const [inProgressSelected, setInProgressSelected] = useState(0)

  const [doneIsChecked, setDoneIsChecked] = useState([])
  const [doneTotalTasks, setDoneTotalTasks] = useState(0)
  const [doneSelectedTasks, setDoneSelectedTasks] = useState(0)

  const [collapseAll, setCollapseAll] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showBacklogOptions, setShowBacklogOptions] = useState(false)
  const [showProgressOptions, setShowProgressOptions] = useState(false)
  const [showDoneOptions, setShowDoneOptions] = useState(false)

  const [selectedCardIndex, setSelectedCardIndex] = useState(null)
  const [taskId, setTaskId] = useState("")

  const [isDeadLineCompleted, setIsDeadLineCompleted] = useState([])
  const [backlogTaskDeadLine, setBacklogTaskDeadLine] = useState([])
  const [progressTaskDeadLine, setProgressTaskDeadLine] = useState([])

  const { isAddTaskActive, setIsAddTaskActive,
    isModelActive, isDeleteModel, setIsDeleteModel, isUpdateTaskActive,
    setIsUpdateTaskActive, setIsTodo, setIsBacklog, setIsInProgress, setIsDone } = useAuth()

  const userName = localStorage.getItem('userName');
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'do MMM, yyyy');
  let formattedDueDate;


  useEffect(() => {
    getBacklogDetails()
    getInProgressdetails()
    getDoneTaskDetails()
  }, [taskDetails])


  // fetching tasks by filter
  useEffect(() => {
    fetchingDetailsByFilter()
    getDoneTaskDetails()
    getAllBacklogTasks()
    getInProgressdetails()
  }, [duration]);

  useEffect(() => {
    const todoPrioritieIcons = setPriorityIcons(taskDetails)
    setPriority(todoPrioritieIcons)

    const backlogPriorityIcons = setPriorityIcons(backlogTasks)
    setBackLogPriority(backlogPriorityIcons)

    const progressPriorityIcons = setPriorityIcons(inProgress)
    setInProgressPriority(progressPriorityIcons)

    const donePriorityIcons = setPriorityIcons(doneTasks)
    setDonePriorities(donePriorityIcons)

    const check = taskDetails.map((task) => task.checkList);
    setIsChecked(check);

    const totalChecklists = check.map((totalCheckList) => totalCheckList.length);
    setTotalCheckLists(totalChecklists);

    const checkBackLog = backlogTasks.map((task) => task.checkList)
    setBacklogIsChecked(checkBackLog)

    const totalBacklogCheckList = checkBackLog.map(totalCheckList => totalCheckList.length)
    setBacklogTotalCheckLists(totalBacklogCheckList)

    const checkInProgress = inProgress.map(task => task.checkList)
    setInProgressIsChecked(checkInProgress)

    const totalBackLogCheckList = checkInProgress.map(totalCheckList => totalCheckList.length)
    setInProgressTotalLists(totalBackLogCheckList)

    const checkDoneTasks = doneTasks.map(task => task.checkList)
    setDoneIsChecked(checkDoneTasks)

    const totalDoneCheckList = checkDoneTasks.map(totalCheckList => totalCheckList.length)
    setDoneTotalTasks(totalDoneCheckList)

  }, [taskDetails, backlogTasks, inProgress, doneTasks]);

  // useEffect to handle the selected checkBoxes
  useEffect(() => {
    const selectedChecklists = isChecked.map((checkedList) => checkedList.filter((item) => item === true).length)
    setSelectedCheckLists(selectedChecklists);

    const selectedBacklogTasks = backlogIsChecked.map(checkedList => checkedList.filter((item) => item === true).length)
    setBackLogSelected(selectedBacklogTasks)

    const selectedProgressTasks = inProgressIsChecked.map(checkedList => checkedList.filter((item) => item === true).length)
    setInProgressSelected(selectedProgressTasks)

    const selectedDoneTasks = doneIsChecked.map(checkedList => checkedList.filter((item) => item === true).length)
    setDoneSelectedTasks(selectedDoneTasks)
  }, [isChecked, backlogIsChecked, inProgressIsChecked, doneIsChecked])

  // useEffect to check dueDate
  useEffect(() => {
    const todoDeadline = updateDeadLine(taskDetails)
    setIsDeadLineCompleted(todoDeadline);
  }, [taskDetails])

  useEffect(() => {
    const backlogDeadLine = updateDeadLine(backlogTasks)
    setBacklogTaskDeadLine(backlogDeadLine)
  }, [backlogTasks])

  useEffect(() => {
    const setInprogressDeadLine = updateDeadLine(inProgress)
    setProgressTaskDeadLine(setInprogressDeadLine)
  }, [inProgress])

  const setPriorityIcons = (tasks) => {
    return tasks.map(task => {
      if (task.selectPriority === 'HIGH PRIORITY') {
        return highPriorityIcon;
      } else if (task.selectPriority === 'MODERATE PRIORITY') {
        return moderatePriorityIcon;
      } else if (task.selectPriority === 'LOW PRIORITY') {
        return lowPriorityIcon;
      }
    })
  }

  // function to check dueDate
  const updateDeadLine = (tasks) => {
    const currentDate = new Date()
    const dueDatesArray = tasks.map(item => parse(item.dueDate, "dd/MM/yyyy", new Date()))
    const checkDueDates = dueDatesArray.map(dueDate => {
      if (dueDate >= currentDate) return false
      if (dueDate < currentDate) return true
    })
    return checkDueDates
  };

  // function to add new task
  const addTask = () => {
    setIsAddTaskActive(true);
  };

  // function to apply filter
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };


  // function to diaplay tasks after creation 
  const reloadBoard = async () => {
    try {
      await fetchingDetailsByFilter()
      await getBacklogDetails()
      await getInProgressdetails()
      await getDoneTaskDetails()
    } catch (error) {
    }
  }

  // function to fetch all the tasks
  const fetchingDetailsByFilter = async () => {
    try {
      const response = await getTaskDetailsByFilter(duration);
      const updatedTaskDetails = response.taskDetails.map((task) => ({
        ...task,
        collapsed: false,
      }));

      const filteredTaskDetails = updatedTaskDetails.filter(task => !backlogTasks.some(backlogTask => backlogTask._id === task._id));
      setTaskDetails(filteredTaskDetails);

    } catch (error) {
      console.log('something went wrong', error);
    }
  }

  // function to collapse individual task
  const toggleTask = (index) => {
    const updatedTaskDetails = [...taskDetails];
    updatedTaskDetails[index] = {
      ...updatedTaskDetails[index],
      collapsed: !updatedTaskDetails[index].collapsed,
    }
    setTaskDetails(updatedTaskDetails);
  };

  const toggleBacklogTask = (index) => {
    const updatedTaskDetails = [...backlogTasks];
    updatedTaskDetails[index] = {
      ...updatedTaskDetails[index],
      collapsed: !updatedTaskDetails[index].collapsed,
    };
    setBacklogTasks(updatedTaskDetails);
  };

  const toggleProgressTask = (index) => {
    const updatedTaskDetails = [...inProgress];
    updatedTaskDetails[index] = {
      ...updatedTaskDetails[index],
      collapsed: !updatedTaskDetails[index].collapsed,
    };
    setInProgress(updatedTaskDetails);
  };

  const toggleDoneTask = (index) => {
    const updatedTaskDetails = [...doneTasks];
    updatedTaskDetails[index] = {
      ...updatedTaskDetails[index],
      collapsed: !updatedTaskDetails[index].collapsed,
    };
    setDoneTasks(updatedTaskDetails);
  };


  // function to collapse all tasks
  const toggleAllTasks = () => {
    const updatedTaskDetails = taskDetails.map((task) => ({
      ...task,
      collapsed: !collapseAll,
    }));
    setTaskDetails(updatedTaskDetails);
    setCollapseAll(!collapseAll);
  };

  const toggleAllBacklogTasks = () => {
    const updatedBacklogTasks = backlogTasks.map((task) => ({
      ...task,
      collapsed: !collapseAll,
    }))
    setBacklogTasks(updatedBacklogTasks)
    setCollapseAll(!collapseAll)
  };

  const toggleAllProgressTask = () => {
    const updatedProgressTasks = inProgress.map(task => ({
      ...task,
      collapsed: !collapseAll
    }))
    setInProgress(updatedProgressTasks)
    setCollapseAll(!collapseAll)
  }

  const toggleAllDoneTask = () => {
    const updatedDoneTasks = doneTasks.map(task => ({
      ...task,
      collapsed: !collapseAll
    }))
    setDoneTasks(updatedDoneTasks)
    setCollapseAll(!collapseAll)
  }

  // function to handle the check box 
  const handleCheckboxChange = (taskIndex, checkboxIndex) => {
    const updatedIsChecked = [...isChecked];
    updatedIsChecked[taskIndex][checkboxIndex] = !updatedIsChecked[taskIndex][checkboxIndex];
    setIsChecked(updatedIsChecked);
  };

  const handleBacklogCheckboxChange = (taskIndex, checkboxIndex) => {
    if (!backlogIsChecked[taskIndex]) {
      const newBacklogIsChecked = backlogTasks.map(() => Array(backlogTasks[taskIndex].checkList.length).fill(false))
      newBacklogIsChecked[taskIndex][checkboxIndex] = !newBacklogIsChecked[taskIndex][checkboxIndex];
      setBacklogIsChecked(newBacklogIsChecked);
    } else {
      const updatedBacklogIsChecked = [...backlogIsChecked];
      updatedBacklogIsChecked[taskIndex][checkboxIndex] = !updatedBacklogIsChecked[taskIndex][checkboxIndex];
      setBacklogIsChecked(updatedBacklogIsChecked);
    }
    const selectedChecklists = backlogIsChecked[taskIndex].filter(item => item).length;
    const updatedBackLogSelected = [...backLogSelected];
    updatedBackLogSelected[taskIndex] = selectedChecklists;
    setBackLogSelected(updatedBackLogSelected);
  };


  const handleInProgressCheckboxChange = (taskIndex, checkboxIndex) => {
    const updatedInProgressIsChecked = [...inProgressIsChecked];
    updatedInProgressIsChecked[taskIndex][checkboxIndex] = !updatedInProgressIsChecked[taskIndex][checkboxIndex];
    setInProgressIsChecked(updatedInProgressIsChecked);

    const selectedChecklists = updatedInProgressIsChecked[taskIndex].filter(item => item === true).length;
    const updatedInProgressSelected = [...inProgressSelected];
    updatedInProgressSelected[taskIndex] = selectedChecklists;
    setInProgressSelected(updatedInProgressSelected);
  };

  const handleDoneCheckboxChange = (taskIndex, checkboxIndex) => {
    const updatedDoneIsChecked = [...doneIsChecked];
    updatedDoneIsChecked[taskIndex][checkboxIndex] = !updatedDoneIsChecked[taskIndex][checkboxIndex];
    setDoneIsChecked(updatedDoneIsChecked);

    const selectedChecklists = updatedDoneIsChecked[taskIndex].filter(item => item === true).length;
    const updatedDoneSelected = [...doneSelected];
    updatedDoneSelected[taskIndex] = selectedChecklists;
    setDoneSelectedTasks(updatedDoneSelected);
  };

  // function to toggle the options button
  const toggleOptions = (index, input) => {
    switch (input) {
      case "todo":
        setSelectedCardIndex(index === selectedCardIndex ? null : index);
        setShowOptions(selectedCardIndex !== index);
        break;
      case "backlog":
        setSelectedCardIndex(index === selectedCardIndex ? null : index);
        setShowBacklogOptions(selectedCardIndex !== index);
        break;
      case "inprogress":
        setSelectedCardIndex(index === selectedCardIndex ? null : index);
        setShowProgressOptions(selectedCardIndex !== index);
        break;
      case "done":
        setSelectedCardIndex(index === selectedCardIndex ? null : index);
        setShowDoneOptions(selectedCardIndex !== index);
        break;
      default:
        break;
    }
  };

  const shareFunctionality = (id) => {
    const readOnlyLink = `${window.location.origin}/share/${id}`
    navigator.clipboard.writeText(readOnlyLink)
    toast.success("Link Copied", {
      position: "top-right", style: {
        border: "1px solid rgba(72, 193, 181, 1)",
        borderRadius: "12px",
        backgroundColor: "rgba(246, 255, 249, 1)",
        marginTop: "2rem",
        width: "10rem"
      }
    })
  }


  const handleClickedContainer = (input1, input2, input3, input4) => {
    setIsTodo(input1)
    setIsInProgress(input2)
    setIsBacklog(input3)
    setIsDone(input4)
  }

  const handleLocalStorage = (input1, input2, input3, input4) => {
    localStorage.setItem("isTodo", input1)
    localStorage.setItem("isInProgress", input2)
    localStorage.setItem("isBacklog", input3)
    localStorage.setItem("isDone", input4)
  }

  // function handles update,delete and sharing of a task
  const handleOptions = async (id, input) => {
    handleClickedContainer(true, false, false, false)

    // for share function 
    handleLocalStorage("true", "false", "false", "false")
    if (input === "deleteTask") {
      setTaskId(id)
      setIsDeleteModel(true)
      setShowOptions(!showOptions)
    }
    if (input === "editTask") {
      setTaskId(id)
      setIsUpdateTaskActive(true)
      setShowOptions(!showOptions)
    }
    if (input === "shareTask") {
      setShowOptions(!showOptions)
      setTaskId(id)
      shareFunctionality(id)
    }
  }

  const handleBacklogOptions = (id, input) => {
    handleClickedContainer(false, false, true, false)
    handleLocalStorage("false", "false", "true", "false")

    if (input === "deleteTask") {
      setTaskId(id)
      setIsDeleteModel(true)
      setShowBacklogOptions(!showBacklogOptions)
    }
    if (input === "editTask") {
      setTaskId(id)
      setIsUpdateTaskActive(true)
      setShowBacklogOptions(!showBacklogOptions)
    }
    if (input === "shareTask") {
      setShowBacklogOptions(!showBacklogOptions)
      setTaskId(id)
      shareFunctionality(id)
    }
  }

  const handlerProgressOptions = (id, input) => {
    handleClickedContainer(false, true, false, false)
    handleLocalStorage("false", "true", "false", "false")

    if (input === "deleteTask") {
      setTaskId(id)
      setIsDeleteModel(true)
      setShowProgressOptions(!setShowProgressOptions)
    }
    if (input === "editTask") {
      setTaskId(id)
      setIsUpdateTaskActive(true)
      setShowProgressOptions(!setShowProgressOptions)
    }
    if (input === "shareTask") {
      setShowProgressOptions(!setShowProgressOptions)
      setTaskId(id)
      shareFunctionality(id)
    }
  }

  const handleDoneOptions = (id, input) => {
    handleClickedContainer(false, false, false, true)
    handleLocalStorage("false", "false", "false", "true")

    if (input === "deleteTask") {
      setTaskId(id)
      setIsDeleteModel(true)
      setShowDoneOptions(!setShowDoneOptions)
    }
    if (input === "editTask") {
      setTaskId(id)
      setIsUpdateTaskActive(true)
      setShowDoneOptions(!setShowDoneOptions)
    }
    if (input === "shareTask") {
      setShowDoneOptions(!setShowDoneOptions)
      setTaskId(id)
      shareFunctionality(id)
    }
  }

  const getBacklogDetails = async () => {
    const backlogTasks = await getAllBacklogTasks(duration)
    if (Array.isArray(backlogTasks.tasks)) {
      setBacklogTasks(backlogTasks.tasks);
    } else {
      setBacklogTasks([]);
    }
  }

  const getInProgressdetails = async () => {
    const inProgressTasks = await getAllInProgressTasks(duration)
    if (Array.isArray(inProgressTasks.tasks)) {
      setInProgress(inProgressTasks.tasks)
    } else {
      setInProgress([]);
    }
  }

  const getDoneTaskDetails = async () => {
    const doneTasks = await getAllDoneTasks(duration)
    if (Array.isArray(doneTasks.tasks)) {
      setDoneTasks(doneTasks.tasks)
    } else {
      setInProgress([]);
    }
  }

  const commonPayLoad = (selectedTask) => {
    const payLoad = {
      title: selectedTask.tasks.title,
      selectPriority: selectedTask.tasks.selectPriority,
      checkList: selectedTask.tasks.checkList,
      taskList: selectedTask.tasks.taskList,
      dueDate: selectedTask.tasks.dueDate
    }
    return payLoad
  }

  // Function to move task to backlog
  const moveToBacklog = async (id, input) => {
    if (input === "todo") {
      const selectedTask = await getTaskById(id)
      await deleteTask(id)
      const payLoad = {
        title: selectedTask.taskDetails.title,
        selectPriority: selectedTask.taskDetails.selectPriority,
        checkList: selectedTask.taskDetails.checkList,
        taskList: selectedTask.taskDetails.taskList,
        dueDate: selectedTask.taskDetails.dueDate
      }
      const postTask = await createBacklogTask(payLoad)
      if (postTask.data.success === true) {
        await getBacklogDetails()
        setTaskDetails(prevTaskDetails => prevTaskDetails.filter(task => task._id !== id))
      }
    }

    if (input === "progress") {
      const selectedTask = await getInprogressTask(id)
      await removeInProgressTask(id)
      const postTask = await createBacklogTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getBacklogDetails()
        await getInProgressdetails()
      }
    }

    if (input === "done") {
      const selectedTask = await getDoneTask(id)
      await removeDoneTask(id)
      const postTask = await createBacklogTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getBacklogDetails()
        await getDoneTaskDetails()
      }
    }
  };

  // move to todo 
  const moveToToDo = async (id, input) => {
    if (input === "backLog") {
      const selectedTask = await getBacklogTask(id)
      await removeBacklogTask(id)
      const postTask = await createTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await fetchingDetailsByFilter()
      }
    }

    if (input === "progress") {
      const selectedTask = await getInprogressTask(id)
      await removeInProgressTask(id)
      const postTask = await createTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await fetchingDetailsByFilter()
        await getInProgressdetails()
      }
    }

    if (input === "done") {
      const selectedTask = await getDoneTask(id)
      await removeDoneTask(id)
      const postTask = await createTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await fetchingDetailsByFilter()
        await getDoneTaskDetails()
      }
    }
  }

  // move to progress
  const moveToProgress = async (id, input) => {
    if (input === "todo") {
      const selectedTask = await getTaskById(id)
      await deleteTask(id)
      const payLoad = {
        title: selectedTask.taskDetails.title,
        selectPriority: selectedTask.taskDetails.selectPriority,
        checkList: selectedTask.taskDetails.checkList,
        taskList: selectedTask.taskDetails.taskList,
        dueDate: selectedTask.taskDetails.dueDate
      }
      const postTask = await createInProgressTask(payLoad)
      if (postTask.data.success === true) {
        await getInProgressdetails()
        setTaskDetails(prevTaskDetails => prevTaskDetails.filter(task => task._id !== id));
      }
    }

    if (input === "backLog") {
      const selectedTask = await getBacklogTask(id)
      await removeBacklogTask(id)
      const postTask = await createInProgressTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getInProgressdetails()
        await getBacklogDetails()
      }
    }

    if (input === "done") {
      const selectedTask = await getDoneTask(id)
      await removeDoneTask(id)
      const postTask = await createInProgressTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getInProgressdetails()
        await getDoneTaskDetails()
      }
    }
  }

  // move to done
  const moveToDone = async (id, input) => {
    if (input === "todo") {
      const selectedTask = await getTaskById(id)
      await deleteTask(id)
      const payLoad = {
        title: selectedTask.taskDetails.title,
        selectPriority: selectedTask.taskDetails.selectPriority,
        checkList: selectedTask.taskDetails.checkList,
        taskList: selectedTask.taskDetails.taskList,
        dueDate: selectedTask.taskDetails.dueDate
      }
      const postTask = await createDoneTask(payLoad)
      if (postTask.data.success === true) {
        await getDoneTaskDetails()
        setTaskDetails(prevTaskDetails => prevTaskDetails.filter(task => task._id !== id));
      }
    }

    if (input === "backLog") {
      const selectedTask = await getBacklogTask(id)
      await removeBacklogTask(id)
      const postTask = await createDoneTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getDoneTaskDetails()
        await getBacklogDetails()
      }
    }

    if (input === "progress") {
      const selectedTask = await getInprogressTask(id)
      await removeInProgressTask(id)
      const postTask = await createDoneTask(commonPayLoad(selectedTask))
      if (postTask.data.success === true) {
        await getDoneTaskDetails()
        await getInProgressdetails()
      }
    }
  }

  const truncateTitle = (title) => {
    const maxCharacters = 15
    if (title.length > maxCharacters) {
      return title.substring(0, maxCharacters) + '...'
    }
    return title
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.detailsContainer}>
          <h1 className={styles.userName}>Welcome! {userName}</h1>
          <p className={styles.text}>Board</p>
        </div>

        <div className={styles.dateAndFilterContainer}>
          <p className={styles.date}>{formattedDate}</p>

          <div className={styles.filter}>
            <select name="" id="" className={styles.dropDown} value={duration} onChange={handleDurationChange}>
              <option value="today">Today</option>
              <option value="this week" selected>
                This week
              </option>
              <option value="this month">This Month</option>
            </select>
          </div>
        </div>
      </header>

      <section className={styles.bottomSection}>

        {/* backlog tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>Backlog</p>
            <img src={collapseIcon} alt="icon" className={styles.icon} onClick={toggleAllBacklogTasks} />
          </div>

          {backlogTasks.map((item, index) => (
            <div className={`${styles.taskCard} ${collapseAll || item.collapsed ? styles.collapsed : ''}`} key={index} style={{ position: isModelActive ? " " : "relative" }}>
              {/* Priority Container */}
              <div className={styles.priorityContainer}>
                <span className={styles.priority}>
                  {backlogPriority[index] && <img src={backlogPriority[index]} alt="" />}
                  <p className={styles.priorityName}>{item.selectPriority}</p>
                </span>
                <img src={optionsIcon} alt="optionsIcon" className={styles.optionsIcon} onClick={() => toggleOptions(index, "backlog")} />
              </div>

              {/* Title */}
              <h1 className={styles.title} title={item.title}>{truncateTitle(item.title)}</h1>

              {/* Checklists */}
              <div className={styles.checkListContainer}>
                {/* Heading */}
                <div className={styles.headingAndExpansionBtn}>
                  <p className={styles.heading}>Checklist ({backLogSelected[index]}/{backlogTotalCheckLists[index]})</p>
                  <img src={item.collapsed ? compressingIcon : expansionIcon} alt="icon" className={styles.arrowIcon} onClick={() => toggleBacklogTask(index)} />
                </div>

                {/* Checkbox and Task Name */}
                {!item.collapsed && (
                  <>
                    {backlogIsChecked[index] && backlogIsChecked[index].map((isCheckedItem, idx) => (

                      <div key={idx} className={styles.tasksConatiner}>
                        <div className={styles.checkboxContainer}>
                          <input type="checkbox" className={styles.checkBox} checked={isCheckedItem} onChange={() => handleBacklogCheckboxChange(index, idx)} />
                        </div>
                        <p className={styles.task}>{item.taskList[idx]}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Controls */}
                <div className={styles.dueDateAndControlsSection}>
                  {item.dueDate ? (
                    <span className={styles.dueDate} style={{
                      backgroundColor: backlogTaskDeadLine[index] ? "rgba(207, 54, 54, 1)" : "rgba(219, 219, 219, 1)",
                      color: backlogTaskDeadLine[index] ? "rgba(255, 255, 255, 1)" : "rgba(90, 90, 90, 1)"
                    }}>
                      {formattedDueDate = format(parse(item.dueDate, 'dd/MM/yyyy', new Date()), 'MMM do')}
                    </span>
                  ) : (
                    <div className={styles.empty}></div>
                  )}
                  <div className={styles.buttonsContainer}>
                    <button className={styles.contolBtns} onClick={() => moveToToDo(item._id, "backLog")}>TO-DO</button>
                    <button className={styles.contolBtns} onClick={() => moveToProgress(item._id, "backLog")}>PROGRESS</button>
                    <button className={styles.contolBtns} onClick={() => moveToDone(item._id, "backLog")}>DONE</button>
                  </div>
                </div>
              </div>
              {selectedCardIndex === index && showBacklogOptions && (
                <div className={styles.optionsContainer}>
                  <p className={styles.options} onClick={() => handleBacklogOptions(item._id, "editTask")}>Edit</p>
                  <p className={styles.options} onClick={() => handleBacklogOptions(item._id, "shareTask")}>Share</p>
                  <p className={styles.options} id={styles.deleteOption} onClick={() => handleBacklogOptions(item._id, "deleteTask")}>Delete</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ...................................................................... */}
        {/* to do tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>To do</p>
            <figure className={styles.imageContainer}>
              <img src={addIcon} alt="icon" className={styles.addIcon} onClick={() => addTask()} />
              <img src={collapseIcon} alt="icon" className={styles.icon} onClick={toggleAllTasks} />
            </figure>
          </div>

          {taskDetails.map((item, index) => {
            const selectedCheckLists2 = selectedCheckLists[index]; // Changed variable name
            const totalCheckLists2 = totalCheckLists[index]; // Changed variable name

            return (
              <div className={`${styles.taskCard} ${collapseAll || item.collapsed ? styles.collapsed : ''}`}
                key={index} style={{ position: isModelActive ? " " : "relative" }}>
                {/* priority Container */}
                <div className={styles.priorityContainer}>
                  <span className={styles.priority}>
                    {priority[index] && <img src={priority[index]} alt="" />}
                    <p className={styles.priorityName}>{item.selectPriority}</p>
                  </span>
                  <img src={optionsIcon} alt="optionsIcon"
                    className={styles.optionsIcon} onClick={() => toggleOptions(index, "todo")} />
                </div>

                {/* title */}
                <h1 className={styles.title} title={item.title}>{truncateTitle(item.title)}</h1>

                {/* checkLists */}
                <div className={styles.checkListContainer}>
                  {/* heading */}
                  <div className={styles.headingAndExpansionBtn}>
                    <p className={styles.heading}>Checklist ({selectedCheckLists2}/{totalCheckLists2})</p>
                    <img
                      src={item.collapsed ? compressingIcon : expansionIcon}
                      alt="icon"
                      className={styles.arrowIcon}
                      onClick={() => toggleTask(index)}
                    />
                  </div>

                  {/* checkbox and task name */}
                  {!item.collapsed && (
                    <>
                      {isChecked[index] && isChecked[index].map((isCheckedItem, idx) => (
                        <div key={idx} className={styles.tasksConatiner}>
                          <div className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              className={styles.checkBox}
                              checked={isCheckedItem}
                              onChange={() => handleCheckboxChange(index, idx)}
                            />
                          </div>
                          <p className={styles.task}>{item.taskList[idx]}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {/* controls */}
                  <div className={styles.dueDateAndControlsSection}>
                    {item.dueDate ? (
                      <span className={styles.dueDate}
                        style={{
                          backgroundColor: isDeadLineCompleted[index] ? "rgba(207, 54, 54, 1)" : "rgba(219, 219, 219, 1)",
                          color: isDeadLineCompleted[index] ? "rgba(255, 255, 255, 1)" : "rgba(90, 90, 90, 1)"
                        }}>
                        {(formattedDueDate = format(parse(item.dueDate, 'dd/MM/yyyy', new Date()), 'MMM do'))}
                      </span>
                    ) : (
                      <div className={styles.empty}></div>
                    )}
                    <div className={styles.buttonsContainer}>
                      <button className={styles.contolBtns} onClick={() => moveToBacklog(item._id, "todo")}>BACKLOG</button>
                      <button className={styles.contolBtns} onClick={() => moveToProgress(item._id, "todo")}>PROGRESS</button>
                      <button className={styles.contolBtns} onClick={() => moveToDone(item._id, "todo")}>DONE</button>
                    </div>
                  </div>


                </div>
                {selectedCardIndex === index && showOptions && (
                  <div className={styles.optionsContainer}>
                    <p className={styles.options} onClick={() => handleOptions(item._id, "editTask")}>Edit</p>
                    <p className={styles.options} onClick={() => handleOptions(item._id, "shareTask")}
                    >Share</p>
                    <p className={styles.options} id={styles.deleteOption}
                      onClick={() => handleOptions(item._id, "deleteTask")}>
                      Delete
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>


        {/* ........................................... */}

        {/* in progress tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>In progress</p>
            <img src={collapseIcon} alt="icon" className={styles.icon} onClick={() => toggleAllProgressTask()} />
          </div>

          {inProgress.map((item, index) => (
            <div className={styles.taskCard} key={index}
              style={{ position: isModelActive ? " " : "relative" }}>
              {/* Priority Container */}
              <div className={styles.priorityContainer}>
                <span className={styles.priority}>
                  {inProgressPriority[index] && <img src={inProgressPriority[index]} alt="" />}
                  <p className={styles.priorityName}>{item.selectPriority}</p>
                </span>
                <img src={optionsIcon} alt="optionsIcon" className={styles.optionsIcon} onClick={() => toggleOptions(index, "inprogress")} />
              </div>

              {/* Title */}
              <h1 className={styles.title} title={item.title}>{truncateTitle(item.title)}</h1>

              {/* Checklists */}
              <div className={styles.checkListContainer}>
                {/* Heading */}
                <div className={styles.headingAndExpansionBtn}>
                  <p className={styles.heading}>Checklist ({inProgressSelected[index]}/{inProgressTotalLists[index]})</p>
                  <img src={item.collapsed ? compressingIcon : expansionIcon} alt="icon" className={styles.arrowIcon} onClick={() => toggleProgressTask(index)} />
                </div>

                {/* Checkbox and Task Name */}
                {!item.collapsed && (
                  <>
                    {inProgressIsChecked[index] && inProgressIsChecked[index].map((isCheckedItem, idx) => (
                      <div key={idx} className={styles.tasksConatiner}>
                        <div className={styles.checkboxContainer}>
                          <input type="checkbox" className={styles.checkBox} checked={isCheckedItem} onChange={() => handleInProgressCheckboxChange(index, idx)} />
                        </div>
                        <p className={styles.task}>{item.taskList[idx]}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Controls */}
                <div className={styles.dueDateAndControlsSection}>
                  {item.dueDate ? (
                    <span className={styles.dueDate} style={{ backgroundColor: progressTaskDeadLine[index] ? "rgba(207, 54, 54, 1)" : "rgba(219, 219, 219, 1)", color: progressTaskDeadLine[index] ? "rgba(255, 255, 255, 1)" : "rgba(90, 90, 90, 1)" }}>
                      {formattedDueDate = format(parse(item.dueDate, 'dd/MM/yyyy', new Date()), 'MMM do')}
                    </span>
                  ) : (
                    <div className={styles.empty}></div>
                  )}
                  <div className={styles.buttonsContainer}>
                    <button className={styles.contolBtns} onClick={() => moveToBacklog(item._id, "progress")}>BACKLOG</button>
                    <button className={styles.contolBtns} onClick={() => moveToToDo(item._id, "progress")}>TO-DO</button>
                    <button className={styles.contolBtns} onClick={() => moveToDone(item._id, "progress")}>DONE</button>
                  </div>
                </div>
              </div>
              {selectedCardIndex === index && showProgressOptions && (
                <div className={styles.optionsContainer}>
                  <p className={styles.options} onClick={() => handlerProgressOptions(item._id, "editTask")}>Edit</p>
                  <p className={styles.options} onClick={() => handlerProgressOptions(item._id, "shareTask")}>Share</p>
                  <p className={styles.options} id={styles.deleteOption} onClick={() => handlerProgressOptions(item._id, "deleteTask")}>Delete</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ............................. */}
        {/* done tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>Done</p>
            <img src={collapseIcon} alt="icon" className={styles.icon} onClick={() => toggleAllDoneTask()} />
          </div>

          {doneTasks.map((item, index) => (
            <div className={styles.taskCard} key={index}
              style={{ position: isModelActive ? " " : "relative" }}>
              {/* Priority Container */}
              <div className={styles.priorityContainer}>
                <span className={styles.priority}>
                  {donePriorities[index] && <img src={donePriorities[index]} alt="" />}
                  <p className={styles.priorityName}>{item.selectPriority}</p>
                </span>
                <img src={optionsIcon} alt="optionsIcon" className={styles.optionsIcon} onClick={() => toggleOptions(index, "done")} />
              </div>

              {/* Title */}
              <h1 className={styles.title} title={item.title}>{truncateTitle(item.title)}</h1>

              {/* Checklists */}
              <div className={styles.checkListContainer}>
                {/* Heading */}
                <div className={styles.headingAndExpansionBtn}>
                  <p className={styles.heading}>Checklist ({doneSelectedTasks[index]}/{doneTotalTasks[index]})</p>
                  <img src={item.collapsed ? compressingIcon : expansionIcon} alt="icon" className={styles.arrowIcon} onClick={() => toggleDoneTask(index, item._id)} />
                </div>

                {/* Checkbox and Task Name */}
                {!item.collapsed && (
                  <>
                    {doneIsChecked[index] && doneIsChecked[index].map((isCheckedItem, idx) => (
                      <div key={idx} className={styles.tasksConatiner}>
                        <div className={styles.checkboxContainer}>
                          <input type="checkbox" className={styles.checkBox} checked={isCheckedItem} onChange={() => handleDoneCheckboxChange(index, idx)} />
                        </div>
                        <p className={styles.task}>{item.taskList[idx]}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Controls */}
                <div className={styles.dueDateAndControlsSection}>
                  {item.dueDate ? (
                    <span className={styles.dueDate} style={{ backgroundColor: "rgba(99, 192, 91, 1)", color: "rgba(255, 255, 255, 1)" }}>
                      {formattedDueDate = format(parse(item.dueDate, 'dd/MM/yyyy', new Date()), 'MMM do')}
                    </span>
                  ) : (
                    <div className={styles.empty}></div>
                  )}
                  <div className={styles.buttonsContainer}>
                    <button className={styles.contolBtns} onClick={() => moveToBacklog(item._id, "done")}>BACKLOG</button>
                    <button className={styles.contolBtns} onClick={() => moveToToDo(item._id, "done")}>TO-DO</button>
                    <button className={styles.contolBtns} onClick={() => moveToProgress(item._id, "done")}>PROGRESS</button>
                  </div>
                </div>
              </div>
              {selectedCardIndex === index && showDoneOptions && (
                <div className={styles.optionsContainer}>
                  <p className={styles.options} onClick={() => handleDoneOptions(item._id, "editTask")}>Edit</p>
                  <p className={styles.options} onClick={() => handleDoneOptions(item._id, "shareTask")}>Share</p>
                  <p className={styles.options} id={styles.deleteOption} onClick={() => handleDoneOptions(item._id, "deleteTask")}>Delete</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {isAddTaskActive ? <AddTaskModel reloadBoard={reloadBoard} /> : <></>}

      {
        isDeleteModel ?
          <DeleteTaskModel
            taskId={taskId}
            taskDetails={taskDetails}
            setTaskDetails={setTaskDetails}
          />
          : <></>
      }

      {
        isUpdateTaskActive ?
          <UpdateTaskModel taskDetails={taskDetails}
            backlogTasks={backlogTasks} inProgress={inProgress} doneTasks={doneTasks}
            taskId={taskId}
            reloadBoard={reloadBoard} />
          :
          <></>
      }
    </main>
  );
};
export default Board;
