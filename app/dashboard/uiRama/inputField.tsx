import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean; // Menambahkan properti readOnly
  className?: string;
}

export default function InputField({
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  readOnly, // Properti readOnly
  className,
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly} // Mengatur properti readOnly pada input
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
