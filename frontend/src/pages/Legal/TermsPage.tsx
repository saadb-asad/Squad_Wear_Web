export const TermsPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-12 py-12">
      <div className="border border-outline p-6 lg:p-10 bg-surface space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-display text-shout text-display-lg text-on-surface">Terms and Conditions</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">1. Introduction</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Welcome to Squad Wear. These Terms and Conditions govern your use of our website and the purchase of our products. By accessing our website, you agree to these Terms and Conditions in full. If you disagree with any part of these terms, you must not use our website.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">2. Products and Pricing</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              All products are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">3. Payment Terms</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We use a secure third-party payment gateway to process all transactions. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">4. Intellectual Property</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              All content included on this site, such as text, graphics, logos, images, and software, is the property of Squad Wear or its content suppliers and protected by international copyright laws.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">5. Contact Information</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Questions about the Terms and Conditions should be sent to us at support@squadwear.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
