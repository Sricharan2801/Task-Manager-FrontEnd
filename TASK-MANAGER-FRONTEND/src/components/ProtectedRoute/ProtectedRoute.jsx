import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = (props) => {
    const { Component } = props
    const navigate = useNavigate()

    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = () => {
       const token =  localStorage.getItem("token");
        if (!token) return navigate("/login")
    }

    return (
        <div>
            <Component />
        </div>
    )
}

export default ProtectedRoute
