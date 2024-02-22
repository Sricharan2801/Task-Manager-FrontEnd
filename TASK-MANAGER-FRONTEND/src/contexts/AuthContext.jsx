import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedToken = localStorage.getItem("token")
        return !!storedToken;
    });

    const [isModelActive, setIsModelActive] = useState(false)
    const [isAddTaskActive,setIsAddTaskActive] = useState(false)

    

    const login = () => {
        setIsLoggedIn(true)
    }

    const logout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId")
    }

    return <AuthContext.Provider value={{ 
        isLoggedIn, login, logout,isModelActive,setIsModelActive,isAddTaskActive,setIsAddTaskActive}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);