export const PrivacyPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-12 py-12">
      <div className="neo-extruded p-6 lg:p-10 rounded-[40px] bg-surface space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Privacy Policy</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">1. Information We Collect</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your name, e-mail address, mailing address, phone number, or credit card information.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">2. How We Use Your Information</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, to process transactions, or to send periodic emails regarding your order or other products and services.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">3. Protection of Your Information</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">4. Disclosure of Information to Outside Parties</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">5. Contacting Us</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              If there are any questions regarding this privacy policy you may contact us using the information below: privacy@squadwear.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
