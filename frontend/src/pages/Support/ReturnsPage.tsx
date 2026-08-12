export const ReturnsPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-12 py-12">
      <div className="neo-extruded p-6 lg:p-10 rounded-[40px] bg-surface space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Return & Refund Policy</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">1. Returns</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">2. Refunds</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">3. Exceptions / Non-returnable Items</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Certain types of items cannot be returned, like custom products (such as special orders or personalized items). Please get in touch if you have questions or concerns about your specific item.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">4. Exchanges</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">5. Contact</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              To start a return, you can contact us at returns@squadwear.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
