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