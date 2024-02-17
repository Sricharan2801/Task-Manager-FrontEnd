import React from 'react'
import styles from "./loginPage.module.scss"
import LoginForm from '../../components/LoginComponents/LoginForm'

const LoginPage = () => {
    return (
        <main className={styles.main}>
            <LoginForm />
        </main>
    )
}

export default LoginPage
