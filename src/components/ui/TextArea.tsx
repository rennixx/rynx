import { forwardRef } from 'react';
import type { TextAreaProps } from '../../types';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    rows = 4,
    className = '',
    ...props
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const textAreaClasses = `
      w-full px-4 py-3 border border-gray-600 rounded-lg resize-vertical bg-black text-white
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
        <textarea
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          rows={rows}
          className={textAreaClasses}
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

TextArea.displayName = 'TextArea';

export default TextArea;
