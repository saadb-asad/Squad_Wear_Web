interface TestimonialCardProps {
  name: string;
  date: string;
  quote: string;
}

export const TestimonialCard = ({ name, date, quote }: TestimonialCardProps) => (
  <div className="flex flex-col gap-4 border border-outline p-6">
    <p className="font-ui text-sm text-on-surface">&ldquo;{quote}&rdquo;</p>
    <div className="font-ui flex items-center justify-between text-xs text-on-surface-variant">
      <span className="font-semibold text-on-surface">{name}</span>
      <span>{date}</span>
    </div>
  </div>
);
