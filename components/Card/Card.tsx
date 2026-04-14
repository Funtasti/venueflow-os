import React from 'react';
import styles from './Card.module.css';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hoverable = false, style }: CardProps) {
  return (
    <div className={classNames(styles.card, { [styles.hoverable]: hoverable }, className)} style={style}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, className }: CardHeaderProps) {
  return (
    <div className={classNames(styles.header, className)}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export function CardContent({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={classNames(styles.content, className)} style={style}>{children}</div>;
}

export function CardFooter({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={classNames(styles.footer, className)} style={style}>{children}</div>;
}
