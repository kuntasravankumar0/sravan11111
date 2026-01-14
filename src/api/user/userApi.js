import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const USERS_API = `${BACKUP_API}/api/users`;

export const createUser = (userData) => axios.post(`${USERS_API}/create`, userData);
export const getAllUsers = () => axios.get(`${USERS_API}/all`);
export const getUserByNumber = (number) => axios.get(`${USERS_API}/getbynumber/${number}`);
export const getUserById = (id) => axios.get(`${USERS_API}/getbyid/${id}`);
export const updateUser = (number, userData) => axios.put(`${USERS_API}/update/${number}`, userData);
export const deleteUser = (number) => axios.delete(`${USERS_API}/delete/${number}`);
export const getOnlineUsers = () => axios.get(`${USERS_API}/online`);

// Deprecated or mapped functions
export const checkUser = (email, number) => axios.post(`${USERS_API}/check`, { email, number });
export const createUserService = createUser;
export const updateUserService = updateUser;
export const deleteUserService = deleteUser;
