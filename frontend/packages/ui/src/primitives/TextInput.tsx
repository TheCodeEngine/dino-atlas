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
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
            {icon}
          </span>
        )}
        <input
          className={[
            "w-full py-2.5 bg-surface-container-low border-[3px] border-on-surface rounded-lg",
            "focus:ring-0 focus:border-primary text-sm font-semibold placeholder:text-outline/40",
            icon ? "pl-9 pr-3" : "px-3",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
    </div>
  );
}
