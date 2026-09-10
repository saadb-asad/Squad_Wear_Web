import { SectionHeading } from '../../components/ui/SectionHeading';
import { BrandMessageBlock } from '../../components/ui/BrandMessageBlock';
import { Button } from '../../components/ui/Button';

export const AboutPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 py-section-y-mobile lg:py-section-y">
      <SectionHeading
        as="h1"
        title="About Squad Wear"
        subtitle="Engineered for the urban environment. Our mission is to fuse high-performance fabrics with streetwear silhouettes built for movement."
      />

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        <div className="border border-outline p-6 lg:p-8 space-y-4">
          <h2 className="font-display text-shout text-display-md text-on-surface">Our Story</h2>
          <p className="font-ui text-sm text-on-surface-variant">
            Born from the necessity of functional everyday wear, Squad Wear began as an experimental project to create garments that could withstand both harsh weather conditions and the aesthetic demands of modern street culture.
          </p>
          <p className="font-ui text-sm text-on-surface-variant">
            We source proprietary materials and partner with state-of-the-art manufacturing facilities to ensure every seam, zipper, and pocket serves a distinct purpose.
          </p>
        </div>

        <div className="border border-outline p-6 lg:p-8 space-y-4">
          <h2 className="font-display text-shout text-display-md text-on-surface">B2B & Custom Orders</h2>
          <p className="font-ui text-sm text-on-surface-variant">
            We provide customized tactical gear and streetwear for teams, corporate clients, and specialized crews. Connect with our dedicated B2B team to discuss your specific requirements.
          </p>
          <div className="pt-4">
            <Button variant="solid">Contact Sales</Button>
          </div>
        </div>
      </div>

      <BrandMessageBlock
        heading="We Don't Restrict Fashion to a Single Budget"
        body="Squad Wear is built to be affordable and inclusive — good fits for everyone, not just a select few."
      />
    </main>
  );
};
