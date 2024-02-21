import React from 'react'
import styles from "./rightSection.module.scss"
import { Outlet } from 'react-router-dom'

const RightSection = () => {
  return (
    <main className={styles.main}>
        <Outlet/>
    </main>
  )
}

export default RightSection
