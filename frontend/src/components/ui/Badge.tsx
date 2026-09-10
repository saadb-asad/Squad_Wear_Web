import type { ReactNode } from 'react';

type BadgeVariant = 'new' | 'sale' | 'sold-out';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  new: 'bg-secondary text-on-secondary',
  sale: 'bg-error text-on-error',
  'sold-out': 'bg-outline text-surface',
};

export const Badge = ({ variant, children }: BadgeProps) => (
  <span className={`font-ui text-shout inline-block px-3 py-1 text-xs ${VARIANT_STYLES[variant]}`}>
    {children}
  </span>
);
