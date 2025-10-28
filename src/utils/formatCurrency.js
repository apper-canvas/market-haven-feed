export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatPrice = (price, compareAtPrice = null) => {
  const formattedPrice = formatCurrency(price);
  if (compareAtPrice && compareAtPrice > price) {
    return {
      price: formattedPrice,
      compareAt: formatCurrency(compareAtPrice),
      savings: formatCurrency(compareAtPrice - price),
      savingsPercent: Math.round(((compareAtPrice - price) / compareAtPrice) * 100),
    };
  }
  return { price: formattedPrice };
};