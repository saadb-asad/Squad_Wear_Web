import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'danger';
}

export const Button = ({ variant = 'solid', className = '', ...props }: ButtonProps) => {
  const base =
    'font-ui text-shout text-sm px-6 py-3 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'solid'
      ? 'bg-on-surface text-surface border-on-surface hover:bg-secondary hover:border-secondary'
      : variant === 'danger'
      ? 'bg-transparent text-error border-error hover:bg-error hover:text-on-error'
      : 'bg-transparent text-on-surface border-on-surface hover:bg-on-surface hover:text-surface';

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};
