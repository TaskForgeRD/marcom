interface StatusBadgeProps {
    startDate: string;
    endDate: string;
  }
  
const StatusBadge: React.FC<StatusBadgeProps> = ({ startDate, endDate }) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const isActive = today >= start && today <= end;

  return (
    <span className={`font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}>
      {isActive ? "Aktif" : "Expired"}
    </span>
  );
};
  
export default StatusBadge;
  