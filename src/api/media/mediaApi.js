import axios from "axios";
import BACKUP_API from "../../myproject/config/apiConfig";

const LINKS_API = `${BACKUP_API}/api/links`;
const COMMENTS_API = `${BACKUP_API}/api/comments`;

// Link Management API
export const getPendingLinks = () => axios.get(`${LINKS_API}/pending`);
export const getAllLinks = () => axios.get(`${LINKS_API}/all`);
export const getLinkByNumber = (number) => axios.get(`${LINKS_API}/getby/${number}`);
export const createLink = (data) => axios.post(`${LINKS_API}/create`, data);
export const updateLink = (number, data) => axios.put(`${LINKS_API}/update/${number}`, data);
export const approveLink = (linkId) => axios.put(`${LINKS_API}/${linkId}/approve`);
export const rejectLink = (linkId) => axios.put(`${LINKS_API}/${linkId}/reject`);
export const deleteLink = (linkId) => axios.delete(`${LINKS_API}/${linkId}`);
export const deleteLinkByNumber = (number) => axios.delete(`${LINKS_API}/delete/${number}`);

// Comments APIs
export const getPendingComments = () => axios.get(`${COMMENTS_API}/pending`);
export const getAllComments = () => axios.get(`${COMMENTS_API}/all`);
export const approveComment = (id) => axios.put(`${COMMENTS_API}/approve/${id}`); // Fixed URL to match Backend
export const rejectComment = (id) => axios.put(`${COMMENTS_API}/reject/${id}`);   // Fixed URL to match Backend
export const deleteComment = (id) => axios.delete(`${COMMENTS_API}/delete/${id}`); // Fixed URL to match Backend
export const createComment = (commentData) => axios.post(`${COMMENTS_API}/submit`, commentData); // Fixed URL to match Backend
