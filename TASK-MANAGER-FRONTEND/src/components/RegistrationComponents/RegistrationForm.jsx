import React, { useState } from 'react'
import styles from "./registrationForm.module.scss";
import RegistrationPageImage from "../../assets/images/RegistrationPageImage.png";
import nameIcon from "../../assets/icons/nameIcon.png";
import email from "../../assets/icons/email.png";
import lockIcon from "../../assets/icons/lockIcon.png"
import viewIcon from "../../assets/icons/viewIcon.png";
import { userRegistration } from '../../API/users';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate()

    // functionality for toggle the password view.
    const viewPassword = () => setShowPassword(prevState => !prevState)
    const viewConfirmPassword = () => setShowConfirmPassword(prevState => !prevState)

    // function to handle changes in form fields.
    const changeHandler = (e) => {
        const { name, value } = e.target

        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    const submitForm = async () => {

        if (!userDetails.name || !userDetails.email ||
            !userDetails.password || !userDetails.confirmPassword) {
            return toast("All fields are required")
        }

        const response = await userRegistration({ ...userDetails })

        console.log(response);

    }

    return (
        <main className={styles.main}>

            <section className={styles.leftSection}>
                <img src={RegistrationPageImage} alt="Image" className={styles.image} />
                <p className={styles.caption}>Welcome aboard my friend
                    <div className={styles.internalText}> just a couple of clicks and we start</div></p>
            </section>

            <section className={styles.rightSection}>
                <p className={styles.heading}>Register</p>

                <form action="" className={styles.form}>
                    <div className={styles.fieldsContainer}>

                        <img src={nameIcon} alt="profileIcon" className={styles.icon} />
                        <input
                            type="text"
                            placeholder='Name'
                            className={styles.formFields}
                            name='name'
                            value={userDetails.name}
                            onChange={changeHandler}
                        />
                    </div>

                    <div className={styles.fieldsContainer}>
                        <img src={email} alt="emailIcon" className={styles.icon} />
                        <input
                            type="email"
                            placeholder='Email'
                            className={styles.formFields}
                            name='email'
                            value={userDetails.email}
                            onChange={changeHandler}
                        />
                    </div>


                    <div className={styles.fieldsContainer}>
                        <img src={lockIcon} alt="lockIcon" className={styles.icon} />

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder='Confirm Password'
                            className={styles.formFields}
                            name='confirmPassword'
                            value={userDetails.confirmPassword}
                            onChange={changeHandler} />

                        <img src={viewIcon} alt="eyeIcon"
                            className={styles.icon}
                            onClick={() => viewConfirmPassword()} />
                    </div>

                    <div className={styles.fieldsContainer}>
                        <img src={lockIcon} alt="lockIcon" className={styles.icon} />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            className={styles.formFields}
                            name='password'
                            value={userDetails.password}
                            onChange={changeHandler} />

                        <img src={viewIcon} alt="eyeIcon"
                            className={styles.icon}
                            onClick={() => viewPassword()} />
                    </div>
                </form>

                <section className={styles.buttons}>

                    <button id={styles.registerBtn}
                        className={styles.btn}
                        onClick={() => submitForm()}
                    >Register</button>

                    <p className={styles.text}>Have an account ?</p>

                    <button id={styles.loginBtn}
                        className={styles.btn}
                        onClick={() => navigate("/login")}
                    >Login</button>
                </section>
            </section>

        </main>
    )
}

export default RegistrationForm
