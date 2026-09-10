interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  as?: 'h1' | 'h2';
}

export const SectionHeading = ({ title, subtitle, className = '', as = 'h2' }: SectionHeadingProps) => {
  const Heading = as;
  return (
    <div className={`space-y-2 ${className}`}>
      <Heading className="font-display text-display-md lg:text-display-lg text-shout text-on-surface">{title}</Heading>
      {subtitle && <p className="font-ui text-sm text-on-surface-variant">{subtitle}</p>}
    </div>
  );
};
