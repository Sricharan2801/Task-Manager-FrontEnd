import axios from "axios";
const baseUrl = "https://task-manager-fkf6.onrender.com";
import toast from "react-hot-toast";
const token = localStorage.getItem("token")
const userId = localStorage.getItem("userId")

export const createTask = async ({title, selectPriority, checkList, taskList, dueDate}) => {
    try {

        const requestUrl = `${baseUrl}/postTask/createTask`
        const requestPayLoad = { title, selectPriority, checkList, taskList, dueDate }
        const response = axios.post(requestUrl, requestPayLoad, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": token,
                "userId":userId
            }
        })
        return response

    } catch (error) {
        if (error.response.data.errorMessage === "Bad Request") return toast("please fill mandatory fields");
        if (error.response.data.errorMessage === "Error in creating job!!") return toast("Error in creating job!!");
        if (error.response.data.errorMessage === "Internal Server Error") return toast("Internal Server Error");
    }
}

export const getAllTasks = async() => {
    try {
        const requestUrl = `${baseUrl}/getTask/totalTasks`
        const response = await axios.get(requestUrl,{
            headers:{
                'Content-Type':"application/json",
                'Authorization':token,
                "userId":userId
            }
        })
        return response.data
        
    } catch (error) {
        console.log("Something went wrong",error);
    }
}

export const getTaskDetailsByFilter = async (duration) => {
    try {
        const requestUrl = `${baseUrl}/getTask/allTasks?duration=${duration}`

        const response = await axios.get(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response.data

    } catch (error) {
        console.log("error", error);
    }
}

export const getTaskById = async (taskId) => {
    try {
        const requestUrl = `${baseUrl}/getTask/task/${taskId}`
        const response = await axios.get(requestUrl,{
            headers:{
                'Content-Type':"application/json",
                'Authorization':token,
                "userId":userId
            }
        })
        return response.data

    } catch (error) {
        console.log("something went wrong", error);
    }
}

export const deleteTask = async (taskId) => {
    try {
        const requestUrl = `${baseUrl}/deleteTask/${taskId}`
        const response = await axios.delete(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": token,
                "userId":userId
            }
        })
        return response.data

    } catch (error) {
        console.log("something went wrong", error);
    }
}

export const editTask = async (taskId, {title, selectPriority, checkList, taskList, dueDate}) => {
    try {
        const requestUrl = `${baseUrl}/updateTask/edit/${taskId}`
        const requestPayLoad = { title, selectPriority, checkList, taskList, dueDate }
        const response = await axios.patch(requestUrl, requestPayLoad, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response

    } catch (error) {
        console.log("Someting went wrong",error);
    }
}