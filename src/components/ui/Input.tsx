import { ChangeEvent } from 'react';

interface InputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    className?: string;
    name?: string;
    disabled?: boolean;
    id?: string;
}

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    className = '',
    name,
    disabled = false,
    id,
}: InputProps) => {
    const inputId = id || name;
    return (
        <div className="mb-5">
            {label && (
                <label
                    className="block text-gray-700 uppercase font-bold mb-2"
                    htmlFor={inputId}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={inputId}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;