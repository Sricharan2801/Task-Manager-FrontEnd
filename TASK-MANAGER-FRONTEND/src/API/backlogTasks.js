import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL
import toast from "react-hot-toast";
const token = localStorage.getItem("token")
const userId = localStorage.getItem("userId")

export const createBacklogTask = async ({ title, selectPriority, checkList, taskList, dueDate }) => {
    try {
        const requestUrl = `${baseUrl}/backlogTasks/createTask`
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

export const getAllBacklogTasks = async () => {
    try {
        const requestUrl = `${baseUrl}/backlogTasks/allTasks`
        const response = await axios.get(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response.data

    } catch (error) {
        console.log("something went wrong in get all backlog");
    }
}

export const getBacklogTask = async (taskId) => {
    console.log(taskId);
    try {
        const requestUrl = `${baseUrl}/backlogTasks/getTask/${taskId}`
        const response = await axios.get(requestUrl, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': token,
                "userId":userId
            }
        })
        return response.data

    } catch (error) {
        console.log("Something went wrong while fetching data in backlog", error);
    }
}

export const removeBacklogTask = async (taskId) => {
    try {
        const requestUrl = `${baseUrl}/backlogTasks/deleteTask/${taskId}`
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

export const editBacklogTask = async (taskId, {title, selectPriority, checkList,
    taskList, dueDate}) => {
    try {
        const requestUrl = `${baseUrl}/backlogTasks/editTask/${taskId}`
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