import React from 'react'
import styles from "./board.module.scss"
import { format } from 'date-fns'
import collapseIcon from "../../../../assets/icons/collapseIcon.png"

const Board = () => {
  const userName = localStorage.getItem("userName")
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'do MMM, yyyy')


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
            <select name="" id="" className={styles.dropDown}>
              <option value="today">Today</option>
              <option value="thisWeek" selected>This week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>
      </header>

      <section className={styles.bottomSection}>
        <div className={styles.taskContainer}>
        <p>Backlog</p>
        </div>

        <div className={styles.taskContainer}>
        <p>To do</p>

        </div>

        <div className={styles.taskContainer}>
        <p>In progress</p>
        </div>

        <div className={styles.taskContainer}>
        <p>Done</p>
        </div>
      </section>
    </main>
  )
}

export default Board
