import WarehouseSidebar from '../../../components/layout/WarehouseSidebar';

const WarehouseDashboard = () => {
  return (
    <div className="flex">
      <WarehouseSidebar />
      <div className="flex-1">
        <div>Welcome to the Warehouse Manager Dashboard</div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
