import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (title: string, subtitle?: string) => {
  toast({
    description: (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-green-800 font-semibold">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>{title}</span>
        </div>
        {subtitle && <span className="text-green-800">{subtitle}</span>}
      </div>
    ),
    className: "bg-green-100 border border-green-300 shadow-md rounded-lg",
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast({
    description: (
      <div className="flex items-center gap-2 text-red-800 font-semibold">
        <XCircle className="h-4 w-4 text-red-600" />
        <span>{message}</span>
      </div>
    ),
    className: "bg-red-100 border border-red-300 shadow-md rounded-lg",
    duration: 3000,
  });
};
