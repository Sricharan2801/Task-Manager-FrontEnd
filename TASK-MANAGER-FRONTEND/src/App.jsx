import React from 'react'
import styles from "./App.module.css"
import { Route, Routes } from 'react-router-dom'
import RegistrationPage from "./pages/registrationPage/RegistrationPage"
import { Toaster } from 'react-hot-toast'
import LoginPage from "./pages/loginPage/LoginPage"


const App = () => {
  return (
    <main className={styles.main}>

      <Routes>
        <Route path='/' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App

