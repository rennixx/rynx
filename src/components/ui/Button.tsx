import { forwardRef } from 'react';
import type { ButtonProps } from '../../types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'solid', 
    size = 'md', 
    className = '', 
    disabled = false,
    type = 'button',
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      solid: 'bg-white text-black hover:bg-gray-200 active:bg-gray-300',
      outline: 'border-2 border-white text-white hover:bg-white hover:text-black active:bg-gray-200',
      ghost: 'text-white hover:bg-gray-800 active:bg-gray-700',
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
