import React, { useState, useEffect } from 'react'
import styles from "./settings.module.scss"
import nameIcon from "../../../../assets/icons/nameIcon.png"
import lockIcon from "../../../../assets/icons/lockIcon.png"
import viewIcon from "../../../../assets/icons/viewIcon.png"
import { updateUserData } from '../../../../API/users'
import toast from 'react-hot-toast'


const Settings = () => {
  const userName = localStorage.getItem("userName")

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false)
  const [details, setDetails] = useState({
    name: userName ? userName : "",
    password: "",
    newPassword: ""
  })
  
  
  

  const viewOldPassword = () => setShowOldPassword(prevState => !prevState)
  const viewNewPassword = () => setShowNewConfirmPassword(prevState => !prevState)

  const changeHandler = (e) => {
    const { name, value } = e.target
    setDetails({
      ...details,
      [name]: value
    })
  }

  const updateUser = async (e) => {
    e.preventDefault()
   const response = await updateUserData({...details})
   console.log(response);
   if(response.message === "Updated Successfully") return toast("Updated Successfully")
  }
  

  return (
    <main className={styles.main}>
      <p className={styles.text}>Settings</p>

      <form action="" className={styles.dataUpdateForm} >
        <div className={styles.fieldsContainer}>
          <img src={nameIcon} alt="icon" className={styles.icon} />
          <input type="text"
            placeholder='Name'
            className={styles.formField}
            name='name'
            value={details.name}
            onChange={changeHandler} />
        </div>

        <div className={styles.fieldsContainer}>
          <img src={lockIcon} alt="icon" className={styles.icon} />
          <input type={showOldPassword ? "text" : "password"}
            placeholder='Old Password'
            className={styles.formField}
            name='password'
            value={details.password}
            onChange={changeHandler} />
          <img src={viewIcon} alt="icon" className={styles.icon} onClick={() => viewOldPassword()} />
        </div>

        <div className={styles.fieldsContainer}>
          <img src={lockIcon} alt="icon" className={styles.icon} />

          <input type={showNewConfirmPassword ? "text" : "password"}
            placeholder='New Password'
            className={styles.formField}
            name='newPassword'
            value={details.newPassword}
            onChange={changeHandler} />

          <img src={viewIcon} alt="icon" className={styles.icon} onClick={() => viewNewPassword()} />
        </div>

        <button className={styles.updateBtn} onClick={(e) => updateUser(e)}>Update</button>
      </form>
    </main>
  )
}

export default Settings
