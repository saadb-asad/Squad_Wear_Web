interface PromoBarProps {
  message: string;
}

export const PromoBar = ({ message }: PromoBarProps) => (
  <div className="w-full bg-[#030302] border-b border-[#d3cec5] px-4 py-2 text-center">
    <p className="font-geist text-xs uppercase tracking-widest text-[#ffffff] font-medium">
      {message}
    </p>
  </div>
);
