import React, { useState, useEffect } from 'react'
import styles from "./leftSection.module.scss"
import codesandbox from "../../../assets/icons/codesandbox.png"
import boardIcon from "../../../assets/icons/boardIcon.png"
import analyticsIcon from "../../../assets/icons/analyticsIcon.png"
import settingsIcon from "../../../assets/icons/settingsIcon.png"
import logoutIcon from "../../../assets/icons/logoutIcon.png"
import { useAuth } from "../../../contexts/AuthContext"
import { useNavigate } from 'react-router-dom'
import Model from '../../Model/Model'


const LeftSection = () => {
    const [elements, setElements] = useState({
        board: true, analytics: false, settings: false
    })
    const [boardBgColor, setboardBgColor] = useState("");
    const [analyticsBgColor, setAnalyticsBgColor] = useState("");
    const [settingsBgColor, setSettingsBgColor] = useState("");
    

    const { setIsModelActive,isModelActive } = useAuth()
    const navigate = useNavigate()

    // useEffect to handle the states 
    useEffect(() => {
        if (elements.board) {
            setboardBgColor("rgba(67, 145, 237, 0.1")
            setAnalyticsBgColor("");
            setSettingsBgColor("")
        }
        if (elements.analytics) {
            setAnalyticsBgColor("rgba(67, 145, 237, 0.1")
            setboardBgColor("")
            setSettingsBgColor("")
        }
        if (elements.settings) {
            setSettingsBgColor("rgba(67, 145, 237, 0.1")
            setAnalyticsBgColor("")
            setboardBgColor("")
        }
    }, [elements])


    const clickHandler = (result) => {
        if (result === "board") {
            setElements({ board: true, analytics: false, settings: false })
            navigate("/dashboard")
        }
        if (result === "analytics") {
            setElements({ board: false, analytics: true, settings: false })
            navigate("/dashboard/analytics")
        }
        if (result === "settings") {
            setElements({ board: false, analytics: false, settings: true })
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
                            style={{ backgroundColor: boardBgColor }}>

                            <img src={boardIcon} alt="logo" className={styles.appLogo} />
                            <p className={styles.appName}>Board</p>
                        </div>

                        <div className={styles.elements} onClick={() => clickHandler("analytics")}
                            style={{ backgroundColor: analyticsBgColor }}>

                            <img src={analyticsIcon} alt="logo" className={styles.appLogo} />
                            <p className={styles.appName}>Analytics</p>
                        </div>

                        <div className={styles.elements} onClick={() => clickHandler("settings")}
                            style={{ backgroundColor: settingsBgColor }}>

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
                    cancelBtnText = {"Cancel"}/> : <></>
                }

            </section>



        </main>
    )
}

export default LeftSection
