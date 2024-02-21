import React, { useState } from 'react'
import styles from "./analytics.module.scss"
import Ellipse from "../../../../assets/icons/Ellipse.png"

const Analytics = () => {
  const [taskDetails, setTaskDetails] = useState({
    backlogTasks: 0, todoTasks: 0, inProgressTasks: 0, completedTasks: 0
  })

  const [priorityDetails, setPriorityDetails] = useState({
    lowPriority: 0, moderatePriority: 0, highPriority: 0
  })

  const [dueDateTasks, setDueDateTask] = useState(0)

  return (
    <main className={styles.main}>
      <p className={styles.text}>Analytics</p>

      <div className={styles.cardContainer}>
        <div className={styles.analyticsCard}>
          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Backlog Tasks</p>
            <p className={styles.fieldValue}>{taskDetails.backlogTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>To-do Tasks</p>
            <p className={styles.fieldValue}>{taskDetails.todoTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>In-Progress Tasks</p>
            <p className={styles.fieldValue}>{taskDetails.inProgressTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Completed Tasks</p>
            <p className={styles.fieldValue}>{taskDetails.completedTasks}</p>
          </div>
        </div>

        <div className={styles.analyticsCard}>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Low Priority</p>
            <p className={styles.fieldValue}>{priorityDetails.lowPriority}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Moderate Priority</p>
            <p className={styles.fieldValue}>{priorityDetails.moderatePriority}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>High Priority</p>
            <p className={styles.fieldValue}>{priorityDetails.highPriority}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Due Date Tasks</p>
            <p className={styles.fieldValue}>{dueDateTasks}</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Analytics
