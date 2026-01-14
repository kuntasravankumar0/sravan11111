import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const CONTACT_API = `${BACKUP_API}/api/contact`;

export const submitContactForm = (formData) => axios.post(`${CONTACT_API}/submit`, formData);
export const getAllMessages = () => axios.get(`${CONTACT_API}/all`);
export const deleteMessage = (id) => axios.delete(`${CONTACT_API}/${id}`);
