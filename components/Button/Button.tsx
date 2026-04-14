import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          { [styles.fullWidth]: fullWidth },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
