interface PromoBarProps {
  message: string;
}

export const PromoBar = ({ message }: PromoBarProps) => (
  <div className="w-full bg-on-surface px-4 py-2 text-center">
    <p className="font-ui text-shout text-xs text-surface">{message}</p>
  </div>
);
