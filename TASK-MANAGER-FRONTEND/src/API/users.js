import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
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
        console.log("Internal Server Error", error);

        if (error.response.data.errorMessage === "Email already exist") {
            return toast("Email already exist!!")
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
        console.log("Internal Server Error");

        if (error.response.data.errorMessage === "User Not Found") return toast("User Name Not Found");
        if (error.response.data.errorMessage === "Incorrect Password") return toast("Incorrect Password");

    }
}

