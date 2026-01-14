import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const ADMIN_API = `${BACKUP_API}/api/Adminaprovel`;

// Admin Management
export const getAllAdmins = () => axios.get(`${ADMIN_API}/all`);
export const getPendingAdmins = () => axios.get(`${ADMIN_API}/pending`);
export const getAdminUser = (customerId) => axios.get(`${ADMIN_API}/get/${customerId}`);

export const approveAdmin = (id) => axios.put(`${ADMIN_API}/approve/${id}`, {});
export const rejectAdmin = (id) => axios.put(`${ADMIN_API}/reject/${id}`, {});

export const updateAdmin = (customerId, userData) => axios.put(`${ADMIN_API}/update/${customerId}`, userData);
export const deleteAdmin = (customerId) => axios.delete(`${ADMIN_API}/delete/${customerId}`);

// Aliases to match old exports if needed by other components
export const getAllAdminUsers = getAllAdmins;
export const deleteAdminUser = deleteAdmin;
export const approveAdminUser = approveAdmin;
export const rejectAdminUser = rejectAdmin;
export const updateAdminUser = updateAdmin;

// Admin Auth (also exported here for convenience)
export const adminLogin = (data) => axios.post(`${ADMIN_API}/login`, data);
export const adminRegister = (data) => axios.post(`${ADMIN_API}/register`, data);
