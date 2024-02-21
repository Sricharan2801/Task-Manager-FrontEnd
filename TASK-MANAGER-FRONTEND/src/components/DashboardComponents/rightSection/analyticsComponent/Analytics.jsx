import React from 'react'
import styles from "./analytics.module.scss"
import Ellipse from "../../../../assets/icons/Ellipse.png"

const Analytics = () => {
  return (
    <main className={styles.main}>
      <p className={styles.text}>Analytics</p>

      <div className={styles.cardContainer}>
        <div className={styles.analyticsCard}>
          <div className={styles.fieldsContainer}>
            <ul>
              <li>Backlog Tasks</li>
            </ul>
          </div>

          <div className={styles.fieldsContainer}>

          </div>

          <div className={styles.fieldsContainer}>

          </div>

          <div className={styles.fieldsContainer}>

          </div>
        </div>

        <div className={styles.analyticsCard}>

          <div className={styles.fieldsContainer}>

          </div>

          <div className={styles.fieldsContainer}>

          </div>

          <div className={styles.fieldsContainer}>

          </div>

          <div className={styles.fieldsContainer}>

          </div>
        </div>
      </div>
    </main>
  )
}

export default Analytics
