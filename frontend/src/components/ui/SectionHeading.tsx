interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeading = ({ title, subtitle, className = '' }: SectionHeadingProps) => (
  <div className={`space-y-2 ${className}`}>
    <h2 className="font-display text-display-md lg:text-display-lg text-shout text-on-surface">{title}</h2>
    {subtitle && <p className="font-ui text-sm text-on-surface-variant">{subtitle}</p>}
  </div>
);
