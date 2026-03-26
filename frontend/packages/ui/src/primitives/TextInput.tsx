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
            className="absolute left-3 material-symbols-outlined text-on-surface-variant"
            style={{ fontSize: "18px", lineHeight: 1, width: "18px", height: "18px" }}
          >
            {icon}
          </span>
        )}
        <input
          className={[
            "w-full py-2.5 bg-surface-container-low border-[3px] border-on-surface rounded-lg",
            "focus:ring-0 focus:border-primary text-sm font-semibold placeholder:text-outline/40",
            icon ? "pl-10 pr-3" : "px-3",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
    </div>
  );
}
