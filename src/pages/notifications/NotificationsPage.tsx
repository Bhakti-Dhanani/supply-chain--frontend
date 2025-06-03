import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../../apis/notifications';
import { Spin, List, Typography } from 'antd';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = 1; // Replace with dynamic user ID logic
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Typography.Title level={3}>Notifications</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.message}
              description={new Date(item.createdAt).toLocaleString()}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationsPage;
