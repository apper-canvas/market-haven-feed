import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const parseArrayField = (value) => {
  if (!value) return [];
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const parseObjectField = (value) => {
  if (!value) return {};
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return {};
  }
};

const transformProduct = (product) => {
  if (!product) return null;
  return {
    Id: product.Id,
    name: product.name_c || '',
    brand: product.brand_c || '',
    category: product.category_c || '',
    subcategory: product.subcategory_c || '',
    price: parseFloat(product.price_c) || 0,
    compareAtPrice: product.compare_at_price_c ? parseFloat(product.compare_at_price_c) : null,
    description: product.description_c || '',
    rating: parseFloat(product.rating_c) || 0,
    reviewCount: parseInt(product.review_count_c) || 0,
    stock: parseInt(product.stock_c) || 0,
    featured: parseInt(product.featured_c) || 0,
    images: parseArrayField(product.images_c),
    sizes: parseArrayField(product.sizes_c),
    colors: parseArrayField(product.colors_c),
    tags: parseArrayField(product.tags_c),
    specifications: parseObjectField(product.specifications_c),
    createdAt: product.CreatedOn || new Date().toISOString(),
  };
};

export const productService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "compare_at_price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "specifications_c" } },
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(transformProduct);
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "compare_at_price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "specifications_c" } },
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Product not found");
      }

      return transformProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "compare_at_price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "specifications_c" } },
        ],
        where: [{
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [category]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(transformProduct);
    } catch (error) {
      console.error("Error fetching category products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "compare_at_price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "specifications_c" } },
        ],
        where: [{
          FieldName: "featured_c",
          Operator: "EqualTo",
          Values: [1]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(transformProduct);
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const searchTerm = query.toLowerCase();

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "compare_at_price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "review_count_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "specifications_c" } },
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "name_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "description_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "brand_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "tags_c", operator: "Contains", values: [searchTerm] }
              ],
              operator: "OR"
            }
          ]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(transformProduct);
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getRecommended(productId, limit = 4) {
    try {
      const product = await this.getById(productId);
      if (!product) return [];

      const categoryProducts = await this.getByCategory(product.category);
      
      return categoryProducts
        .filter(p => p.Id !== parseInt(productId))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching recommended products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const payload = {
        records: [{
          name_c: productData.name,
          brand_c: productData.brand,
          category_c: productData.category,
          subcategory_c: productData.subcategory || '',
          price_c: parseFloat(productData.price),
          compare_at_price_c: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
          description_c: productData.description || '',
          rating_c: parseFloat(productData.rating) || 0,
          review_count_c: parseInt(productData.reviewCount) || 0,
          stock_c: parseInt(productData.stock) || 0,
          featured_c: parseInt(productData.featured) || 0,
          images_c: JSON.stringify(productData.images || []),
          sizes_c: JSON.stringify(productData.sizes || []),
          colors_c: JSON.stringify(productData.colors || []),
          tags_c: JSON.stringify(productData.tags || []),
          specifications_c: JSON.stringify(productData.specifications || {}),
        }]
      };

      const response = await apperClient.createRecord('product_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create product");
        }
        return transformProduct(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(productData.name && { name_c: productData.name }),
          ...(productData.brand && { brand_c: productData.brand }),
          ...(productData.category && { category_c: productData.category }),
          ...(productData.subcategory !== undefined && { subcategory_c: productData.subcategory }),
          ...(productData.price !== undefined && { price_c: parseFloat(productData.price) }),
          ...(productData.compareAtPrice !== undefined && { compare_at_price_c: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null }),
          ...(productData.description !== undefined && { description_c: productData.description }),
          ...(productData.rating !== undefined && { rating_c: parseFloat(productData.rating) }),
          ...(productData.reviewCount !== undefined && { review_count_c: parseInt(productData.reviewCount) }),
          ...(productData.stock !== undefined && { stock_c: parseInt(productData.stock) }),
          ...(productData.featured !== undefined && { featured_c: parseInt(productData.featured) }),
          ...(productData.images && { images_c: JSON.stringify(productData.images) }),
          ...(productData.sizes && { sizes_c: JSON.stringify(productData.sizes) }),
          ...(productData.colors && { colors_c: JSON.stringify(productData.colors) }),
          ...(productData.tags && { tags_c: JSON.stringify(productData.tags) }),
          ...(productData.specifications && { specifications_c: JSON.stringify(productData.specifications) }),
        }]
      };

      const response = await apperClient.updateRecord('product_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update product");
        }
        return transformProduct(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const response = await apperClient.deleteRecord('product_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete product");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      throw error;
    }
  }
};