import React from 'react'
import styles from "./dashboardPage.module.scss";
import DashBoardComponnet from '../../components/DashboardComponents/DashBoardComponnet';

const DashboardPage = () => {

    return (
        <main className={styles.main}>
            <DashBoardComponnet />
        </main>
    )
}

export default DashboardPage
