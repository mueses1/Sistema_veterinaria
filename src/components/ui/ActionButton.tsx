import React from 'react';
import Button from './Button';

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const ActionButton = ({
  children,
  className = '',
  disabled,
  ...rest
}: ActionButtonProps) => {
  const base = `
    w-full flex items-center justify-center gap-2 rounded-xl px-1 py-1
    text-sm font-semibold tracking-wide
    transition-all duration-200 ease-out

    bg-indigo-600 text-white
    hover:bg-indigo-500

    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
    focus-visible:ring-indigo-400
  `;

  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-sm'
    : '';

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      className={`${base} ${disabledClasses} ${className}`.replace(/\s+/g, ' ').trim()}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ActionButton;