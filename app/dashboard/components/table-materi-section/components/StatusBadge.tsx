import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  start_date: string;
  end_date: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ end_date }) => {
  const today = new Date();
  const end = new Date(end_date);

  const isActive = today <= end;

  return (
    <Badge
      variant={!isActive ? "destructive" : "secondary"}
      className={`text-xs ${isActive ? "bg-green-100 text-green-700 border border-green-300" : ""}`}
    >
      {" "}
      {isActive ? "Aktif" : "Expired"}
    </Badge>
  );
};

export default StatusBadge;
