import React, { useState } from 'react'
import styles from "./loginForm.module.scss"
import RegistrationPageImage from "../../assets/images/RegistrationPageImage.png";
import email from "../../assets/icons/email.png";
import lockIcon from "../../assets/icons/lockIcon.png";
import viewIcon from "../../assets/icons/viewIcon.png";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userAuthentication } from '../../API/users';
import { useAuth } from '../../contexts/AuthContext';


const LoginForm = () => {
    const navigate = useNavigate()
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        password: ""
    })

    const { login } = useAuth();

    // functionality for toggle the password view.
    const viewPassword = () => setPasswordVisibility(prevState => !prevState)

    // function to handle changes in form fields.
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setUserCredentials({
            ...userCredentials,
            [name]: value
        })
    }

    // function for loginButton
    const loginUser = async () => {
        if (!userCredentials.email || !userCredentials.password) return toast.error("All fields are required");
        const response = await userAuthentication({ ...userCredentials })
        if (response.success) {
            localStorage.setItem("token", response.token)
            localStorage.setItem("userName", response.userName)
            localStorage.setItem("userId", response.userId)
            login()
            navigate("/dashBoard")
            return toast.success("Login Successfull..")
        }
    }

    return (
        <main className={styles.main}>
            <section className={styles.leftSection}>
                <img src={RegistrationPageImage} alt="Image" className={styles.image} />
                <div className={styles.caption}>Welcome aboard my friend
                    <div className={styles.internalText}> just a couple of clicks and we start</div>
                </div>
            </section>

            <section className={styles.rightSection}>
                <div className={styles.heading}>Login</div>

                <form action="" className={styles.form}>

                    <div className={styles.fieldContainer}>
                        <img src={email} alt="" className={styles.icon} />

                        <input type="email"
                            placeholder='Email'
                            className={styles.formFields}
                            name='email'
                            value={userCredentials.email}
                            onChange={changeHandler} 
                            autoComplete="new-password"/>

                    </div>

                    <div className={styles.fieldContainer}>
                        <img src={lockIcon} alt="" className={styles.icon} />

                        <input type={passwordVisibility ? "text" : "password"}
                            placeholder='Password'
                            className={styles.formFields}
                            name='password'
                            value={userCredentials.password}
                            onChange={changeHandler}
                            autoComplete="new-password"
                        />

                        <img src={viewIcon} alt="eyeIcon"
                            className={styles.icon}
                            onClick={() => viewPassword()}
                        />
                    </div>
                </form>

                <section className={styles.buttons}>

                    <button id={styles.loginBtn}
                        className={styles.btn}
                        onClick={() => loginUser()}
                    >Login</button>

                    <p className={styles.text}>Have no account yet?</p>

                    <button id={styles.registerBtn}
                        className={styles.btn}
                        onClick={() => navigate("/")}
                    >Register</button>
                </section>
            </section>

        </main>
    )
}

export default LoginForm
