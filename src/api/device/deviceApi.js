import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const PRESENCE_API = `${BACKUP_API}/api/presence`;

export const getOnlineUsers = () => axios.get(`${PRESENCE_API}/online`);
export const getOnlineUsersCount = () => axios.get(`${PRESENCE_API}/count`);

export const pingPresence = (userData) => axios.post(`${PRESENCE_API}/ping`, userData);
export const updatePresence = pingPresence; // Alias

export const submitFeedback = (feedbackData) => axios.post(`${PRESENCE_API}/feedback`, feedbackData);

