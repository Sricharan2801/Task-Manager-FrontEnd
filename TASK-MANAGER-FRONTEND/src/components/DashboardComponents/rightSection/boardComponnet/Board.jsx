import React, { useState, useEffect } from 'react';
import styles from './board.module.scss';
import { getTaskDetailsByFilter } from '../../../../API/tasks';
import { format, isAfter, parse } from 'date-fns';
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
  const [priority, setPriority] = useState([])
  const [isChecked, setIsChecked] = useState([])

  const [collapseAll, setCollapseAll] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedCheckLists, setSelectedCheckLists] = useState([])
  const [totalCheckLists, setTotalCheckLists] = useState([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(null)
  const [taskId, setTaskId] = useState("")
  const [isDeadLineCompleted, setIsDeadLineCompleted] = useState()

  const { isAddTaskActive, setIsAddTaskActive } = useAuth()
  const { isModelActive, isDeleteModel, setIsDeleteModel } = useAuth()
  const { isUpdateTaskActive, setIsUpdateTaskActive } = useAuth()



  const userName = localStorage.getItem('userName');
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'do MMM, yyyy');
  let formattedDueDate;

  useEffect(() => {
    fetchingDetailsByFilter();
  }, [duration]);

  useEffect(() => {
    const priorities = taskDetails.map((task) => {
      if (task.selectPriority === 'HIGH PRIORITY') {
        return highPriorityIcon;
      } else if (task.selectPriority === 'MODERATE PRIORITY') {
        return moderatePriorityIcon;
      } else if (task.selectPriority === 'LOW PRIORITY') {
        return lowPriorityIcon;
      }
    });
    setPriority(priorities);

    const check = taskDetails.map((task) => task.checkList);
    setIsChecked(check);

    const totalChecklists = check.map((totalCheckList) => totalCheckList.length);
    setTotalCheckLists(totalChecklists);
  }, [taskDetails]);

  // useEffect to handle the selected checkBoxes
  useEffect(() => {
    const selectedChecklists = isChecked.map((checkedList) => checkedList.filter((item) => item === true).length)
    setSelectedCheckLists(selectedChecklists);
  }, [isChecked])

  // useEffect to check dueDate
  useEffect(() => {
    updateDeadLine()
  }, [taskDetails])

  // function to check dueDate
  const updateDeadLine = () => {
    const currentDate = new Date()
    const formattedCurrentDate = format(currentDate, "dd/MM/yyyy")
    const dueDates = taskDetails.map(item => item.dueDate)
    const checkDueDates = dueDates.map(date => {
      if (date >= formattedCurrentDate) return false
      if (date < formattedCurrentDate) return true
    })
    setIsDeadLineCompleted(checkDueDates);
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
      setTaskDetails(updatedTaskDetails);
    } catch (error) {
      console.log('something went wrong', error);
    }
  };

  // function to collapse individual task
  const toggleTask = (index) => {
    const updatedTaskDetails = [...taskDetails];
    updatedTaskDetails[index] = {
      ...updatedTaskDetails[index],
      collapsed: !updatedTaskDetails[index].collapsed,
    };
    setTaskDetails(updatedTaskDetails);
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

  // function to handle the check box 
  const handleCheckboxChange = (taskIndex, checkboxIndex) => {
    const updatedIsChecked = [...isChecked];
    updatedIsChecked[taskIndex][checkboxIndex] = !updatedIsChecked[taskIndex][checkboxIndex];
    setIsChecked(updatedIsChecked);
  };

  // function to toggle the options button
  const toggleOptions = (index) => {
    setSelectedCardIndex(index === selectedCardIndex ? null : index);
    setShowOptions(selectedCardIndex !== index); // Show options only if the selected card index is not the same as the clicked index
  };


  // function handles update,delete and sharing of a task
  const handleOptions = async (taskId, input) => {

    if (input === "deleteTask") {
      setTaskId(taskId)
      setIsDeleteModel(true)
      setShowOptions(!showOptions)
    }

    if (input === "editTask") {
      setTaskId(taskId)
      setIsUpdateTaskActive(true)
      setShowOptions(!showOptions)
    }
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
            <img src={collapseIcon} alt="icon" className={styles.icon} />
          </div>
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
                    className={styles.optionsIcon} onClick={() => toggleOptions(index)} />

                </div>

                {/* title */}
                <h1 className={styles.title}>{item.title}</h1>

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
                      <button className={styles.contolBtns}>BACKLOG</button>
                      <button className={styles.contolBtns}>PROGRESS</button>
                      <button className={styles.contolBtns}>DONE</button>
                    </div>
                  </div>


                </div>
                {selectedCardIndex === index && showOptions && (
                  <div className={styles.optionsContainer}>
                    <p className={styles.options} onClick={() => handleOptions(item._id, "editTask")}>Edit</p>
                    <p className={styles.options}
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
            <img src={collapseIcon} alt="icon" className={styles.icon} />
          </div>
        </div>

        {/* done tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>Done</p>
            <img src={collapseIcon} alt="icon" className={styles.icon} />
          </div>
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
            taskId={taskId}
            reloadBoard={reloadBoard} />
          :
          <></>
      }


    </main>
  );
};

export default Board;
