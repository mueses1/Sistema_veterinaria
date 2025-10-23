import { ReactNode, MouseEvent } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    type?: ButtonType;
    disabled?: boolean;
    className?: string;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}: ButtonProps) => {
    const baseClasses = 'font-bold uppercase rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-500 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-500 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-500 hover:bg-green-700 text-white focus:ring-green-500',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500'
    };

    const sizes: Record<ButtonSize, string> = {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-6',
        lg: 'py-3 px-8 text-lg'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
};

export default Button;