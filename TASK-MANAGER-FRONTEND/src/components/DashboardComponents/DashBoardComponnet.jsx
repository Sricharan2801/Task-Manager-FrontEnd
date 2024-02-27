import React, { useEffect, useState } from 'react'
import styles from "./dashBoardComponent.module.scss"
import LeftSection from './leftSection/LeftSection'
import RightSection from './rightSection/RightSection'


const DashBoardComponnet = () => {

    return (
        <main className={styles.main}>

            <section className={styles.leftSection}>
                <LeftSection />
            </section>

            <section className={styles.rightSection}>
               <RightSection/>
            </section>

        </main>
    )
}

export default DashBoardComponnet
