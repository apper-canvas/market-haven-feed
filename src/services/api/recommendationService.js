import { getApperClient } from "@/services/apperClient";

// Helper function to create delay for realistic async behavior
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get trending products based on ratings and popularity
export const getTrendingProducts = async (limit = 8) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('product_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'stock_c' } },
        { field: { Name: 'category_id_c' } }
      ],
      orderBy: [{ fieldName: 'rating_c', sorttype: 'DESC' }],
      pagingInfo: { limit, offset: 0 }
    });
if (!response.success || !response.data) {
      console.error('Failed to fetch trending products:', response.message);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error.message);
    return [];
  }
};

// Get personalized recommendations based on user's order history
export const getUserRecommendations = async (userId, limit = 6) => {
  try {
    if (!userId) {
      return getTrendingProducts(limit);
    }

    const apperClient = getApperClient();
    
    // Fetch user's order history to understand preferences
    const ordersResponse = await apperClient.fetchRecords('order_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'user_id_c' } },
        { field: { Name: 'product_ids_c' } }
      ],
      where: [{
        FieldName: 'user_id_c',
        Operator: 'EqualTo',
        Values: [userId]
      }],
      pagingInfo: { limit: 50, offset: 0 }
    });

    if (!ordersResponse.success || !ordersResponse.data || ordersResponse.data.length === 0) {
      return getTrendingProducts(limit);
    }

    // Extract category preferences from order history
const orderedProductIds = [];
    ordersResponse.data.forEach(order => {
      if (order.product_ids_c) {
        const ids = order.product_ids_c.split(',').map(id => parseInt(id.trim()));
        orderedProductIds.push(...ids);
      }
    });

    if (orderedProductIds.length === 0) {
      return getTrendingProducts(limit);
    }
    // Fetch products similar to previously ordered items
    const productsResponse = await apperClient.fetchRecords('product_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'stock_c' } },
        { field: { Name: 'category_id_c' } }
      ],
      orderBy: [{ fieldName: 'rating_c', sorttype: 'DESC' }],
      pagingInfo: { limit: limit * 2, offset: 0 }
    });

    if (!productsResponse.success || !productsResponse.data) {
      return getTrendingProducts(limit);
    }

    // Filter out already ordered products and return top rated
    const recommendations = productsResponse.data
      .filter(product => !orderedProductIds.includes(product.Id))
      .slice(0, limit);

    return recommendations;
  } catch (error) {
    console.error('Error fetching user recommendations:', error.message);
    return [];
  }
};

// Get general product recommendations with optional filtering
export const getRecommendations = async (options = {}) => {
  const {
    limit = 12,
    category = null,
    minRating = null,
    excludeIds = [],
    sortBy = 'rating'
  } = options;

  try {
    const apperClient = getApperClient();
    
    const where = [];
    
    if (category) {
      where.push({
        FieldName: 'category_id_c',
        Operator: 'EqualTo',
        Values: [category]
      });
    }

    if (minRating) {
      where.push({
        FieldName: 'rating_c',
        Operator: 'GreaterThanOrEqualTo',
        Values: [minRating]
      });
    }

    if (excludeIds.length > 0) {
      where.push({
        FieldName: 'Id',
        Operator: 'ExactMatch',
        Values: excludeIds,
        Include: false
      });
    }

    const orderByField = sortBy === 'price' ? 'price_c' : 'rating_c';
    const response = await apperClient.fetchRecords('product_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'stock_c' } },
        { field: { Name: 'category_id_c' } }
      ],
      where,
      orderBy: [{ fieldName: orderByField, sorttype: 'DESC' }],
      pagingInfo: { limit, offset: 0 }
    });

    if (!response.success || !response.data) {
      console.error('Failed to fetch recommendations:', response.message);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    return [];
  }
};

// Get products related to a specific product (same category, excluding current product)
export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    const apperClient = getApperClient();
    
    // First, get the current product to find its category
    const productResponse = await apperClient.getRecordById('product_c', productId, {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'category_id_c' } }
      ]
    });

    if (!productResponse.success || !productResponse.data) {
      return getTrendingProducts(limit);
    }

    const categoryId = productResponse.data.category_id_c;
    
    if (!categoryId) {
      return getTrendingProducts(limit);
    }

    // Fetch products in the same category, excluding current product
    const relatedResponse = await apperClient.fetchRecords('product_c', {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'stock_c' } },
        { field: { Name: 'category_id_c' } }
      ],
      where: [
        {
          FieldName: 'category_id_c',
          Operator: 'EqualTo',
          Values: [categoryId]
        },
        {
          FieldName: 'Id',
          Operator: 'ExactMatch',
          Values: [productId],
          Include: false
        }
      ],
      orderBy: [{ fieldName: 'rating_c', sorttype: 'DESC' }],
      pagingInfo: { limit, offset: 0 }
    });

    if (!relatedResponse.success || !relatedResponse.data) {
      return getTrendingProducts(limit);
    }

    return relatedResponse.data;
  } catch (error) {
    console.error('Error fetching related products:', error.message);
    return [];
}
};

// Service object export for component consumption
export const recommendationService = {
  getPersonalizedRecommendations: async (limit = 6) => {
    return await getUserRecommendations(null, limit);
  },
  getUserRecommendations,
  getTrendingProducts,
  getRecommendations,
  getRelatedProducts
};