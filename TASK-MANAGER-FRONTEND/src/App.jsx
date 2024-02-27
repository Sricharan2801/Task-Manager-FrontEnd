import React, { useContext } from 'react'
import styles from "./App.module.css"
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import RegistrationPage from "./pages/registrationPage/RegistrationPage";
import LoginPage from "./pages/loginPage/LoginPage";
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Board from './components/DashboardComponents/rightSection/boardComponnet/Board';
import Settings from './components/DashboardComponents/rightSection/settingsComponnet/Settings';
import Analytics from './components/DashboardComponents/rightSection/analyticsComponent/Analytics';
import PageNotFound from './components/PageNotFound';


const App = () => {

  return (
    <main className={styles.main}>

      <Routes>
        <Route path='/' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashBoard' element={<ProtectedRoute Component={DashboardPage} />} >
          <Route path="" element={<Board />} />
          
          <Route path='settings' element={<Settings />} />
          <Route path='analytics' element={<Analytics/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      <Toaster />
     
    </main>
  )
}

export default App

