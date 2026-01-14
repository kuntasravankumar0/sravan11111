import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const GOOGLE_INFO_API = `${BACKUP_API}/api/googleinfo`;
const ADMIN_API = `${BACKUP_API}/api/Adminaprovel`;

// Admin Auth
export const adminLogin = (data) => axios.post(`${ADMIN_API}/login`, data);
export const adminRegister = (data) => axios.post(`${ADMIN_API}/register`, data);

// Google Auth APIs
export const syncGoogleUser = (data) => axios.post(`${GOOGLE_INFO_API}`, data); // Changed from /sync to base URL as per Refactoring
export const getGoogleUser = (googleId) => axios.get(`${GOOGLE_INFO_API}/${googleId}`);
export const getAllGoogleUsers = () => axios.get(`${GOOGLE_INFO_API}`);
export const deleteGoogleUser = (googleId) => axios.delete(`${GOOGLE_INFO_API}/${googleId}`);

// Standard Auth (Aliases or Placeholders if needed)
export const login = adminLogin; // Defaulting to admin login if specific user login isn't separate
export const register = adminRegister;
export const logout = () => Promise.resolve({ data: { status: true, message: "Logged out locally" } }); 
