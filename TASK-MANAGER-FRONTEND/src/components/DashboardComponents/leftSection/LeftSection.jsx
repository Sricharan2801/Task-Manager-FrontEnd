import React, { useState, useEffect } from 'react'
import styles from "./leftSection.module.scss"
import codesandbox from "../../../assets/icons/codesandbox.png"
import boardIcon from "../../../assets/icons/boardIcon.png"
import analyticsIcon from "../../../assets/icons/analyticsIcon.png"
import settingsIcon from "../../../assets/icons/settingsIcon.png"
import logoutIcon from "../../../assets/icons/logoutIcon.png"
import { useAuth } from "../../../contexts/AuthContext"
import { useNavigate } from 'react-router-dom'
import Model from "../../Model/logout/Model"


const LeftSection = () => {
    const [elements, setElements] = useState({
        board:true, 
        analytics:false, 
        settings:false
    })
    


    const { setIsModelActive,isModelActive } = useAuth()
    const navigate = useNavigate()

    const clickHandler = (result) => {
        if (result === "board") {
            setElements({board:true,analytics:false,settings:false})
            navigate("/dashboard")
        }
        if (result === "analytics") {
            setElements({board:false,analytics:true,settings:false})
            navigate("/dashboard/analytics")
        }
        if (result === "settings") {
            setElements({board:false,analytics:false,settings:true})
            navigate("/dashboard/settings")
        }
    }

    // function for signout
    const signOut = () => {
        setIsModelActive(true)
    }

    return (
        <main className={styles.main}>
            <section className={styles.leftSection}>
                <nav className={styles.sideNavBar}>
                    <div className={styles.headingContainer}>
                        <img src={codesandbox} alt="logo" className={styles.appLogo} />
                        <p className={styles.appName}>Pro Manage</p>
                    </div>

                    <div className={styles.optionsContainer}>
                        <div className={styles.elements} onClick={() => clickHandler("board")}
                            style={{ backgroundColor: elements.board? "rgba(67, 145, 237, 0.1" :""}}>

                            <img src={boardIcon} alt="logo" className={styles.appLogo} />
                            <p className={styles.appName}>Board</p>
                        </div>

                        <div className={styles.elements} onClick={() => clickHandler("analytics")}
                            style={{ backgroundColor: elements.analytics? "rgba(67, 145, 237, 0.1" : "" }}>

                            <img src={analyticsIcon} alt="logo" className={styles.appLogo} />
                            <p className={styles.appName}>Analytics</p>
                        </div>

                        <div className={styles.elements} onClick={() => clickHandler("settings")}
                            style={{ backgroundColor: elements.settings? "rgba(67, 145, 237, 0.1" :"" }}>

                            <img src={settingsIcon} alt="logo" className={styles.appLogo} />
                            <p className={styles.appName}>Settings</p>
                        </div>
                    </div>
                </nav>

                <div className={styles.logoutContainer}>
                    <img src={logoutIcon} alt="logo" className={styles.exitLogo} />
                    <p className={styles.text} onClick={() => signOut()}>Log out</p>
                </div>

                {
                    isModelActive?<Model 
                    text={"Are you sure you want to Logout?"}
                    proceedBtnText = {"Yes,  Logout"}
                    cancelBtnText = {"Cancel"}
                   /> : <></>
                }

            </section>
        </main>
    )
}

export default LeftSection
