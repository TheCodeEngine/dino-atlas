import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
}

export function TextInput({ label, icon, className = "", ...props }: TextInputProps) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span
            className="absolute left-4 material-symbols-outlined text-on-surface-variant"
            style={{ fontSize: "20px", lineHeight: 1, width: "20px", height: "20px" }}
          >
            {icon}
          </span>
        )}
        <input
          className={[
            "w-full py-3 bg-surface-container-low border-[3px] border-on-surface rounded-lg",
            "focus:ring-0 focus:border-primary text-sm font-semibold placeholder:text-outline/40",
            icon ? "pl-12 pr-4" : "px-4",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
    </div>
  );
}
