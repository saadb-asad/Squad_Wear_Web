interface BrandMessageBlockProps {
  heading: string;
  body: string;
}

export const BrandMessageBlock = ({ heading, body }: BrandMessageBlockProps) => (
  <div className="bg-on-surface px-6 py-section-y-mobile text-center lg:py-section-y">
    <p className="font-display text-display-md text-shout mx-auto max-w-3xl text-surface lg:text-display-lg">
      {heading}
    </p>
    <p className="font-ui mx-auto mt-4 max-w-xl text-sm text-surface/70">{body}</p>
  </div>
);
