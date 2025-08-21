import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";

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
  readOnly,
  className,
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = get(errors, name)?.message as string;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={readOnly ? "text-gray-500 cursor-not-allowed" : ""}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}
