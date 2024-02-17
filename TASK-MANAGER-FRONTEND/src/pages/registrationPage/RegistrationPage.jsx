import React from 'react'
import styles from "./registrationPage.module.scss"
import RegistrationForm from '../../components/RegistrationComponents/RegistrationForm'

const RegistrationPage = () => {
    return (
        <main className={styles.main}>
            <RegistrationForm />
        </main>
    )
}

export default RegistrationPage
