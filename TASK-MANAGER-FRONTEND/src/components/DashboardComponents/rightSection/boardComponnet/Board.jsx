import React, { useState, useEffect } from 'react'
import styles from "./board.module.scss"
import { getTaskDetailsByFilter } from '../../../../API/tasks'
import { format } from 'date-fns'
import collapseIcon from "../../../../assets/icons/collapseIcon.png"
import addIcon from "../../../../assets/icons/addIcon.png"
import AddTaskModel from '../../../Model/AddTaskModel'
import { useAuth } from '../../../../contexts/AuthContext'


const Board = () => {
  const userName = localStorage.getItem("userName")
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'do MMM, yyyy')

  const { isAddTaskActive, setIsAddTaskActive } = useAuth()

  const [duration, setDuration] = useState("this week");


  const addTask = () => {
    setIsAddTaskActive(true)
  }

  const handleDurationChange = (e) => {
    setDuration(e.target.value)
  }

  useEffect(() => {
    fetchingDetailsByFilter()
  }, [duration])

  const fetchingDetailsByFilter = async () => {
    try {
      const response = await getTaskDetailsByFilter(duration);
      console.log(response);
    } catch (error) {
      console.log("something went wrong", error);
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
            <select name="" id="" className={styles.dropDown}
              value={duration} onChange={handleDurationChange}>
              <option value="today">Today</option>
              <option value="this week" selected>This week</option>
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

        {/* to do tasks */}
        <div className={styles.taskContainer}>
          <div className={styles.fieldsContainer}>
            <p className={styles.taskName}>To do</p>

            <figure className={styles.imageContainer}>
              <img src={addIcon} alt="icon"
                className={styles.addIcon} onClick={() => addTask()} />
              <img src={collapseIcon} alt="icon"
                className={styles.icon} />
            </figure>
          </div>
        </div>

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

      {
        isAddTaskActive ? <AddTaskModel /> : <></>
      }
    </main>
  )
}

export default Board
