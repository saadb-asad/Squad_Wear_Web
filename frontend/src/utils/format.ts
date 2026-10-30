/**
 * Formats numeric price into Pakistani Rupee (Rs. / PKR) format.
 * Example: 2800 -> "Rs. 2,800"
 */
export function formatPrice(price: number): string {
  if (isNaN(price)) return 'Rs. 0';
  return `Rs. ${Math.round(price).toLocaleString('en-PK')}`;
}
