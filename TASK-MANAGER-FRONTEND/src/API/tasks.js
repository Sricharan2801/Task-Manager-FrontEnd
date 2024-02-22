import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import toast from "react-hot-toast";

export const createTask = async (title, selectPriority, checkList, taskList, dueDate) => {
    try {
        const token = localStorage.getItem("token");
        const requestUrl = `${baseUrl}/postTask/createTask`
        const requestPayLoad = { title, selectPriority, checkList, taskList, dueDate }
        const response = axios.post(requestUrl, requestPayLoad, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": token
            }
        })
        return response

    } catch (error) {
        if (error.response.data.errorMessage === "Bad Request") return toast("please fill mandatory fields");
        if(error.response.data.errorMessage === "Error in creating job!!") return toast("Error in creating job!!");
        if(error.response.data.errorMessage === "Internal Server Error") return toast("Internal Server Error");
    }
}