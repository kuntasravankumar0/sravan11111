import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const CRICK_API = `${API_BASE_URL}/api/cricklinks`;

export const getAllCrickLinks = () => axios.get(CRICK_API);
export const getCrickLinkById = (id) => axios.get(`${CRICK_API}/${id}`);
export const getCrickLinksByCustomerId = (customerId) => axios.get(`${CRICK_API}/customer/${customerId}`);
export const createCrickLink = (data) => axios.post(CRICK_API, data);
export const updateCrickLink = (id, data) => axios.put(`${CRICK_API}/${id}`, data);
export const deleteCrickLink = (id) => axios.delete(`${CRICK_API}/${id}`);
export const deleteCrickLinksByCustomerId = (customerId) => axios.delete(`${CRICK_API}/customer/${customerId}`);
