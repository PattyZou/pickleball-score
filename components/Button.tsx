import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'neutral' | 'ghost';
  fullHeight?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'neutral', 
  fullHeight = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100 shadow-lg flex items-center justify-center";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-900/50",
    danger: "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-900/50",
    neutral: "bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/50",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300 shadow-none",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${fullHeight ? 'h-full' : 'py-4 px-6'} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
