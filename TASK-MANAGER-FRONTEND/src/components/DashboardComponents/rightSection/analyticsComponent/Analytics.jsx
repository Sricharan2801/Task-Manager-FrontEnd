import React, { useEffect, useState } from 'react'
import styles from "./analytics.module.scss"
import Ellipse from "../../../../assets/icons/Ellipse.png"
import { getAllTasks } from '../../../../API/tasks'
import { getAllBacklogTasks } from '../../../../API/backlogTasks'
import { getAllInProgressTasks } from '../../../../API/inProgressTask'
import { getAllDoneTasks } from '../../../../API/doneTasks'
import { parse } from 'date-fns'

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    backLogTasks: 0, todoTasks: 0, inProgressTasks: 0, completedTasks: 0,
    lowPriorityTasks: 0, highPriorityTasks: 0, moderatePriorityTasks: 0, dueDateTasks: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const todoTasks = await getAllTasks()
    const backlogTasks = await getAllBacklogTasks()
    const inProgressTasks = await getAllInProgressTasks()
    const doneTasks = await getAllDoneTasks()

    const todoArray = Object.values(todoTasks.taskDetails)
    const backlogArray = Object.values(backlogTasks.tasks)
    const inProgressArray = Object.values(inProgressTasks.tasks)

    const lowPriorityTasksOfTodo = todoArray.filter(task => task.selectPriority === "LOW PRIORITY").length
    const lowPriorityTasksOfBacklog = backlogArray.filter(task => task.selectPriority === "LOW PRIORITY").length
    const lowPriorityTasksOfInProgress = inProgressArray.filter(task => task.selectPriority === "LOW PRIORITY").length

    const moderatePriorityOfTodo = todoArray.filter(task => task.selectPriority === "MODERATE PRIORITY").length
    const moderatePriorityOfBacklog = backlogArray.filter(task => task.selectPriority === "MODERATE PRIORITY").length
    const moderatePriorityOfInProgress = inProgressArray.filter(task => task.selectPriority === "MODERATE PRIORITY").length

    const highPriorityOfTodo = todoArray.filter(task => task.selectPriority === "HIGH PRIORITY").length
    const highPriorityOfBacklog = backlogArray.filter(task => task.selectPriority === "HIGH PRIORITY").length
    const highPriorityOfInProgress = inProgressArray.filter(task => task.selectPriority === "HIGH PRIORITY").length

    const totalLowPriorityTasks = lowPriorityTasksOfTodo + lowPriorityTasksOfBacklog + lowPriorityTasksOfInProgress
    const totalModeratePriorityTasks = moderatePriorityOfTodo + moderatePriorityOfBacklog + moderatePriorityOfInProgress
    const totalHighPriorityTasks = highPriorityOfTodo + highPriorityOfBacklog + highPriorityOfInProgress

    const currentDate = new Date()
    const dueDatesInTodo= todoArray.filter(task => parse(task.dueDate,"dd/MM/yyyy",currentDate) >= currentDate).length
    const dueDatesInProgress = inProgressArray.filter(task => parse(task.dueDate,"dd/MM/yyyy",currentDate) >= currentDate).length
    const dueDatesInBacklog = backlogArray.filter(task => parse(task.dueDate,"dd/MM/yyyy",currentDate) >= currentDate).length
    const totalDueDates = dueDatesInTodo + dueDatesInBacklog + dueDatesInProgress
   
    setAnalyticsData({
      backLogTasks:Object.keys(backlogTasks.tasks).length,
      todoTasks:Object.keys(todoTasks.taskDetails).length,
      inProgressTasks:Object.keys(inProgressTasks.tasks).length,
      completedTasks:Object.keys(doneTasks.tasks).length,
      lowPriorityTasks:totalLowPriorityTasks,
      highPriorityTasks:totalHighPriorityTasks,
      moderatePriorityTasks:totalModeratePriorityTasks,
      dueDateTasks:totalDueDates
    })
  }

  return (
    <main className={styles.main}>
      <p className={styles.text}>Analytics</p>

      <div className={styles.cardContainer}>
        <div className={styles.analyticsCard}>
          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Backlog Tasks</p>
            <p className={styles.fieldValue}>{analyticsData.backLogTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>To-do Tasks</p>
            <p className={styles.fieldValue}>{analyticsData.todoTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>In-Progress Tasks</p>
            <p className={styles.fieldValue}>{analyticsData.inProgressTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Completed Tasks</p>
            <p className={styles.fieldValue}>{analyticsData.completedTasks}</p>
          </div>
        </div>

        <div className={styles.analyticsCard}>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Low Priority</p>
            <p className={styles.fieldValue}>{analyticsData.lowPriorityTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Moderate Priority</p>
            <p className={styles.fieldValue}>{analyticsData.moderatePriorityTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>High Priority</p>
            <p className={styles.fieldValue}>{analyticsData.highPriorityTasks}</p>
          </div>

          <div className={styles.fieldsContainer}>
            <img src={Ellipse} alt="" className={styles.icon} />
            <p className={styles.fieldName}>Due Date Tasks</p>
            <p className={styles.fieldValue}>{analyticsData.dueDateTasks}</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Analytics
