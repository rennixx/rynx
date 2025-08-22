import { forwardRef } from 'react';
import type { InputProps } from '../../types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    className = '',
    ...props
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const inputClasses = `
      w-full px-4 py-3 border border-gray-600 rounded-lg bg-black text-white
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
      disabled:bg-gray-700 disabled:cursor-not-allowed
      transition-colors duration-200
      ${error ? 'border-red-500 focus:ring-red-400' : ''}
      ${className}
    `;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
