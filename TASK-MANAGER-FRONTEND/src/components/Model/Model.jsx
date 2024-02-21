import React, { useState } from 'react'
import styles from "./model.module.css"
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Model = ({ text, proceedBtnText, cancelBtnText }) => {

    const navigate = useNavigate()

    const { setIsModelActive,logout } = useAuth()

    const toggleModal = (response) => {
        if (response === "cancel") {
            setIsModelActive(false)
        }
        if(response === "logout"){
            setIsModelActive(false);
            logout()
            navigate("/login")
        }
    };

    return (
        <>
            <div className={styles.modal}>
                <div onClick={toggleModal} className={styles.overlay}></div>
                <div className={styles.modalContent}>
                    <p className={styles.text}>{text ? text : ""}</p>
                    <button className={styles.proceedBtn} onClick={() => toggleModal("logout")}>{proceedBtnText ? proceedBtnText : ""}</button>
                    <button className={styles.cancelBtn} onClick={() => toggleModal("cancel")}>{cancelBtnText ? cancelBtnText : ""}</button>
                </div>
            </div>
        </>
    )
}

export default Model
