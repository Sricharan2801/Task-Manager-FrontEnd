import axios from "axios";
const baseUrl = " https://task-manager-hkmw.onrender.com/api/v1"
import toast from "react-hot-toast";

export const userRegistration = async ({ name, email, password, confirmPassword }) => {
    try {
        const requestUrl = `${baseUrl}/registration/signUp`
        const requestPayLoad = {
            name, email, password, confirmPassword
        }
        const response = await axios.post(requestUrl, requestPayLoad);
        return response.data;
    } catch (error) {
        if (error.response.data.errorMessage === "Email already exist") {
            return toast.error("Email already exist!!")
        }

        if (error.response.data.errorMessage === "password and confirm-password should be same") {
            return toast.error("password and confirm-password should be same")
        }
    }
}

export const userAuthentication = async ({ email, password }) => {

    try {
        const requestUrl = `${baseUrl}/authentication/signIn`
        const requestPayLoad = { email, password }

        const response = await axios.post(requestUrl, requestPayLoad)
        return response.data
    } catch (error) {
        if (error.response.data.errorMessage === "User Not Found") return toast.error("User Name Not Found");
        if (error.response.data.errorMessage === "Incorrect Password") return toast.error("Incorrect Password");
    }
}

export const updateUserData = async ({ name, password, newPassword }) => {
    
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    try {
        const requestUrl = `${baseUrl}/updateUser/${userId}`
        const requestPayLoad = { name, password, newPassword }

        const response = await axios.patch(requestUrl, requestPayLoad, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        return response.data

    } catch (error) {
        console.log("something went wrong", error);
        if(error.response.data.errorMessage = "old password is incorrect") return toast.error("old password is incorrect");
        if(error.response.data.errorMessage="Error in updating user Details") return toast.error("Error in updating user Details");
    }
}