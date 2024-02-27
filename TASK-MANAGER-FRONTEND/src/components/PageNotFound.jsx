import React from 'react'

const PageNotFound = () => {
    return (
        <main style={{
            width: "100vw", height: "100vh", display: "flex", flexDirection:"column",
            justifyContent: "center", alignItems: "center",gap:"5%","fontFamily":"poppins"
        }}>
            <h1>404 - Page Not Found</h1>
           
            <p style={{
                fontSize:"1rem",
                fontWeight:"500"
            }}>page you are looking for is does not exist</p>
        </main>
    )
}

export default PageNotFound

