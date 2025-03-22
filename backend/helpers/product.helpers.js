export const sanitizeProduct = (product) => {
  const sanitized = product.toObject ? product.toObject() : { ...product };
  delete sanitized.total_cost;
  return sanitized;
};
