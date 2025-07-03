interface StatusBadgeProps {
  start_date: string;
  end_date: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ start_date, end_date }) => {
  const today = new Date();
  const start = new Date(start_date);
  const end = new Date(end_date);

  const isActive = today >= start && today <= end;

  return (
    <span
      className={`font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}
    >
      {isActive ? "Aktif" : "Expired"}
    </span>
  );
};

export default StatusBadge;
