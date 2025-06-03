import axios from '../config/axios.config';

// Fetch notifications for a specific user
export const fetchNotifications = async (userId: number) => {
  try {
    const response = await axios.get(`/notifications?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark a notification as viewed
export const markNotificationAsViewed = async (notificationId: number) => {
  try {
    const response = await axios.patch(`/notifications/${notificationId}`, { viewed: true });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as viewed:', error);
    throw error;
  }
};

// Fetch unread notification count for a specific user
export const fetchUnreadNotificationCount = async () => {
  try {
    const response = await axios.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
};

// Fetch unread notification count and notifications for the current user
export const fetchUnreadNotificationCountAndDetails = async () => {
  try {
    const response = await axios.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
};

// Mark a notification as read in the database
export const markNotificationAsReadInDatabase = async (notificationId: number) => {
  try {
    const response = await axios.patch(`/notifications/mark-as-read/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read in database:', error);
    throw error;
  }
};