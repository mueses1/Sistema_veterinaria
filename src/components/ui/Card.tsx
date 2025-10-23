import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    title?: string;
    className?: string;
    padding?: string;
}

const Card = ({
    children,
    title,
    className = '',
    padding = 'p-6'
}: CardProps) => {
    return (
        <div className={`bg-white shadow-md rounded-xl ${padding} ${className}`}>
            {title && (
                <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
            )}
            {children}
        </div>
    );
};

export default Card;