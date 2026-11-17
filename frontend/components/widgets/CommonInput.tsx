"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";

import { Input } from "@/components/ui/input";

interface CommonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function CommonInput({
  label,
  icon,
  error = "",
  className = "",
  type = "text",
  id,
  required,
  ...props
}: CommonInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {required && <span className="text-xs font-normal text-slate-400">Required</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <Input
          {...props}
          id={id}
          type={inputType}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`h-11 rounded-lg px-3.5 text-sm ${icon ? "pl-10" : ""} ${isPassword ? "pr-11" : ""} ${error ? "border-red-500 focus-visible:ring-red-500/30" : ""} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && id && <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
