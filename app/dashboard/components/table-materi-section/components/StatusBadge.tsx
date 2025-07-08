interface StatusBadgeProps {
  start_date: string;
  end_date: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ end_date }) => {
  const today = new Date();
  const end = new Date(end_date);

  const isActive = today <= end;

  return (
    <span
      className={`font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}
    >
      {isActive ? "Aktif" : "Expired"}
    </span>
  );
};

export default StatusBadge;
