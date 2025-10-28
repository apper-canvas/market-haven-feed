import productsData from '../mockData/products.json';
import ordersData from '../mockData/orders.json';

// Helper function to create delay for realistic async behavior
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load products data
const products = Array.isArray(productsData) ? productsData : [];

// Load orders data
const orders = Array.isArray(ordersData) ? ordersData : [];

/**
 * Calculate similarity score between two products based on multiple factors
 */
function calculateProductSimilarity(product1, product2) {
  let score = 0;
  
  // Same category (highest weight)
  if (product1.category === product2.category) {
    score += 40;
  }
  
  // Same subcategory
  if (product1.subcategory === product2.subcategory) {
    score += 20;
  }
  
  // Same brand
  if (product1.brand === product2.brand) {
    score += 15;
  }
  
  // Similar price range (within 30%)
  const priceDiff = Math.abs(product1.price - product2.price);
  const avgPrice = (product1.price + product2.price) / 2;
  const priceVariation = priceDiff / avgPrice;
  
  if (priceVariation < 0.1) {
    score += 15;
  } else if (priceVariation < 0.3) {
    score += 10;
  }
  
  // Similar rating (within 1 star)
  const ratingDiff = Math.abs(product1.rating - product2.rating);
  if (ratingDiff < 0.5) {
    score += 10;
  } else if (ratingDiff < 1) {
    score += 5;
  }
  
  return score;
}

/**
 * Get products frequently bought together based on order history
 */
function getFrequentlyBoughtTogether(productId) {
  const productOrders = orders.filter(order => 
    order.items.some(item => item.productId === productId)
  );
  
  const coOccurrence = {};
  
  productOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId !== productId) {
        coOccurrence[item.productId] = (coOccurrence[item.productId] || 0) + 1;
      }
    });
  });
  
  return Object.entries(coOccurrence)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);
}

/**
 * Get user's purchase history product IDs
 */
function getUserPurchaseHistory() {
  // In real app, this would be user-specific
  // For mock, aggregate all orders
  const purchasedProductIds = new Set();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      purchasedProductIds.add(item.productId);
    });
  });
  
  return Array.from(purchasedProductIds);
}

/**
 * Get user's browsing history from localStorage
 */
function getBrowsingHistory() {
  try {
    const history = localStorage.getItem('browsing_history');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

/**
 * Save product to browsing history
 */
function addToBrowsingHistory(productId) {
  try {
    const history = getBrowsingHistory();
    const updated = [productId, ...history.filter(id => id !== productId)].slice(0, 20);
    localStorage.setItem('browsing_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save browsing history:', error);
  }
}

/**
 * Get cart items from Redux store (via localStorage fallback)
 */
function getCartItems() {
  try {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    
    const cart = JSON.parse(cartData);
    return cart.items || [];
  } catch {
    return [];
  }
}

/**
 * Get wishlist items from Redux store (via localStorage fallback)
 */
function getWishlistItems() {
  try {
    const wishlistData = localStorage.getItem('wishlist');
    if (!wishlistData) return [];
    
    const wishlist = JSON.parse(wishlistData);
    return wishlist.items || [];
  } catch {
    return [];
  }
}

/**
 * Content-based filtering: Find similar products based on attributes
 */
function contentBasedRecommendations(productId, limit = 10) {
  const product = products.find(p => p.Id === parseInt(productId));
  if (!product) return [];
  
  const scored = products
    .filter(p => p.Id !== product.Id && p.stock > 0)
    .map(p => ({
      product: p,
      score: calculateProductSimilarity(product, p)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
  
  return scored;
}

/**
 * Collaborative filtering: Recommend based on similar user behavior patterns
 */
function collaborativeFiltering(productId, limit = 10) {
  const frequentlyBought = getFrequentlyBoughtTogether(productId);
  
  return frequentlyBought
    .slice(0, limit)
    .map(id => products.find(p => p.Id === parseInt(id)))
    .filter(Boolean)
    .filter(p => p.stock > 0);
}

/**
 * Get trending products based on ratings and review counts
 */
function getTrendingProducts(limit = 10, excludeIds = []) {
  return products
    .filter(p => p.stock > 0 && !excludeIds.includes(p.Id))
    .sort((a, b) => {
      const scoreA = a.rating * Math.log(a.reviewCount + 1);
      const scoreB = b.rating * Math.log(b.reviewCount + 1);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Get recommendations based on user's cart
 */
function getCartBasedRecommendations(limit = 10) {
  const cartItems = getCartItems();
  if (cartItems.length === 0) return [];
  
  const cartProductIds = cartItems.map(item => item.product.Id);
  const recommendations = new Map();
  
  cartItems.forEach(item => {
    const similar = contentBasedRecommendations(item.product.Id, 5);
    similar.forEach(product => {
      if (!cartProductIds.includes(product.Id)) {
        recommendations.set(product.Id, product);
      }
    });
  });
  
  return Array.from(recommendations.values()).slice(0, limit);
}

/**
 * Get recommendations based on user's wishlist
 */
function getWishlistBasedRecommendations(limit = 10) {
  const wishlistItems = getWishlistItems();
  if (wishlistItems.length === 0) return [];
  
  const wishlistProductIds = wishlistItems.map(id => parseInt(id));
  const recommendations = new Map();
  
  wishlistItems.forEach(productId => {
    const similar = contentBasedRecommendations(productId, 5);
    similar.forEach(product => {
      if (!wishlistProductIds.includes(product.Id)) {
        recommendations.set(product.Id, product);
      }
    });
  });
  
  return Array.from(recommendations.values()).slice(0, limit);
}

/**
 * Get recommendations based on purchase history
 */
function getPurchaseHistoryRecommendations(limit = 10) {
  const purchasedIds = getUserPurchaseHistory();
  if (purchasedIds.length === 0) return [];
  
  const recommendations = new Map();
  
  purchasedIds.forEach(productId => {
    const similar = contentBasedRecommendations(productId, 3);
    similar.forEach(product => {
      if (!purchasedIds.includes(product.Id.toString())) {
        const currentScore = recommendations.get(product.Id)?.score || 0;
        recommendations.set(product.Id, {
          product,
          score: currentScore + 1
        });
      }
    });
  });
  
  return Array.from(recommendations.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}

/**
 * Get recommendations based on browsing history
 */
function getBrowsingHistoryRecommendations(limit = 10) {
  const history = getBrowsingHistory();
  if (history.length === 0) return [];
  
  const recentViews = history.slice(0, 5);
  const recommendations = new Map();
  
  recentViews.forEach(productId => {
    const similar = contentBasedRecommendations(productId, 3);
    similar.forEach(product => {
      if (!history.includes(product.Id.toString())) {
        recommendations.set(product.Id, product);
      }
    });
  });
  
  return Array.from(recommendations.values()).slice(0, limit);
}

/**
 * Hybrid recommendation algorithm combining multiple strategies
 */
async function getPersonalizedRecommendations(limit = 12) {
  await delay();
  
  const recommendations = new Map();
  
  // Strategy 1: Cart-based (weight: 3)
  const cartRecs = getCartBasedRecommendations(8);
  cartRecs.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 3
    });
  });
  
  // Strategy 2: Wishlist-based (weight: 2.5)
  const wishlistRecs = getWishlistBasedRecommendations(8);
  wishlistRecs.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 2.5
    });
  });
  
  // Strategy 3: Purchase history (weight: 2)
  const purchaseRecs = getPurchaseHistoryRecommendations(8);
  purchaseRecs.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 2
    });
  });
  
  // Strategy 4: Browsing history (weight: 1.5)
  const browsingRecs = getBrowsingHistoryRecommendations(8);
  browsingRecs.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 1.5
    });
  });
  
  // Sort by score and get top recommendations
  const sorted = Array.from(recommendations.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
  
  // If not enough personalized recommendations, fill with trending
  if (sorted.length < limit) {
    const excludeIds = sorted.map(p => p.Id);
    const trending = getTrendingProducts(limit - sorted.length, excludeIds);
    return [...sorted, ...trending];
  }
  
  return sorted.slice(0, limit);
}

/**
 * Get similar products for a specific product (for product detail page)
 */
async function getSimilarProducts(productId, limit = 8) {
  await delay();
  
  addToBrowsingHistory(productId);
  
  const recommendations = new Map();
  
  // Strategy 1: Collaborative filtering (frequently bought together)
  const collaborative = collaborativeFiltering(productId, 4);
  collaborative.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 3
    });
  });
  
  // Strategy 2: Content-based filtering (similar attributes)
  const contentBased = contentBasedRecommendations(productId, 6);
  contentBased.forEach(product => {
    recommendations.set(product.Id, {
      product,
      score: (recommendations.get(product.Id)?.score || 0) + 2
    });
  });
  
  // Sort by score
  const sorted = Array.from(recommendations.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
  
  // Fill with trending if needed
  if (sorted.length < limit) {
    const excludeIds = [parseInt(productId), ...sorted.map(p => p.Id)];
    const trending = getTrendingProducts(limit - sorted.length, excludeIds);
    return [...sorted, ...trending];
  }
  
  return sorted.slice(0, limit);
}

export const recommendationService = {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getCartBasedRecommendations,
  getWishlistBasedRecommendations,
  getPurchaseHistoryRecommendations,
  getTrendingProducts,
  addToBrowsingHistory
};