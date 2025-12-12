import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
