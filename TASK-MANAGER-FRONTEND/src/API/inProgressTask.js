import axios from "axios";
const baseUrl = " https://task-manager-hkmw.onrender.com/api/v1"
import toast from "react-hot-toast";
const token = localStorage.getItem("token")
const userId = localStorage.getItem("userId")

export const createInProgressTask = async ({ title, selectPriority, checkList, taskList, dueDate }) => {
    try {
        const requestUrl = `${baseUrl}/inProgressTasks/createTask`
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
        console.log("Someting went wrong...", error);
    }
}

export const getAllInProgressTasks = async (duration) => {
    try {
        const requestUrl = `${baseUrl}/inProgressTasks/allTasks/?duration=${duration}`
        const response = await axios.get(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response.data
    } catch (error) {
        console.log("something went wrong in get all in-progress");
    }
}

export const getInprogressTask = async (taskId) => {
    try {
        const requestUrl = `${baseUrl}/inProgressTasks/getTask/${taskId}`
        const response = await axios.get(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response.data
    } catch (error) {
        console.log("Something went wrong while fetching data inprogress", error);
    }
}

export const removeInProgressTask = async(taskId)=>{
    try {
        const requestUrl = `${baseUrl}/inProgressTasks/deleteTask/${taskId}`
        const response = await axios.delete(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": token,
                "userId":userId
            }
        })
        return response.data
    } catch (error) {
        console.log("Something went wrong");
    }
}

export const editInprogressTask = async (taskId, {title, selectPriority, checkList,
    taskList, dueDate}) => {
    try {
        const requestUrl = `${baseUrl}/inProgressTasks/editTask/${taskId}`
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
        console.log("Something went wrong in edit backlog");
    }
}