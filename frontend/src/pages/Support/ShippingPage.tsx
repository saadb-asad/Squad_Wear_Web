export const ShippingPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-12 py-12">
      <div className="border border-outline p-6 lg:p-10 bg-surface space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-display text-shout text-display-lg text-on-surface">Shipping Policy</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">1. Shipment Processing Time</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md">
              If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">2. Shipping Rates & Delivery Estimates</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <ul className="list-disc pl-5 text-on-surface-variant font-body-md text-body-md space-y-2">
              <li><strong>Standard Shipping:</strong> 3-5 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days</li>
            </ul>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2">
              Delivery delays can occasionally occur due to unforeseen circumstances.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">3. Shipment Confirmation & Order Tracking</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
            </p>
          </div>

          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">4. Customs, Duties, and Taxes</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Squad Wear is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
            </p>
          </div>
          
          <div className="border border-outline p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-display text-shout text-display-md text-on-surface">5. Damages</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Squad Wear is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Please save all packaging materials and damaged goods before filing a claim.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
