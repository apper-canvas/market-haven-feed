import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const transformReview = (review) => {
  if (!review) return null;
  return {
    Id: review.Id,
    productId: review.product_id_c || '',
    rating: parseInt(review.rating_c) || 0,
    title: review.title_c || '',
    comment: review.comment_c || '',
    reviewerName: review.reviewer_name_c || '',
    date: review.date_c || new Date().toISOString(),
    verified: review.verified_c || false,
    helpfulVotes: parseInt(review.helpful_votes_c) || 0,
  };
};

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "product_id_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } },
          { field: { Name: "helpful_votes_c" } },
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(transformReview);
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('review_c', parseInt(id), {
        fields: [
          { field: { Name: "product_id_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } },
          { field: { Name: "helpful_votes_c" } },
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Review not found");
      }

      return transformReview(response.data);
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByProductId(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          { field: { Name: "product_id_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "comment_c" } },
          { field: { Name: "reviewer_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "verified_c" } },
          { field: { Name: "helpful_votes_c" } },
        ],
        where: [{
          FieldName: "product_id_c",
          Operator: "EqualTo",
          Values: [productId.toString()]
        }],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(transformReview);
    } catch (error) {
      console.error("Error fetching product reviews:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(reviewData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const payload = {
        records: [{
          product_id_c: reviewData.productId.toString(),
          rating_c: parseInt(reviewData.rating) || 0,
          title_c: reviewData.title || '',
          comment_c: reviewData.comment || '',
          reviewer_name_c: reviewData.reviewerName || '',
          date_c: new Date().toISOString(),
          verified_c: false,
          helpful_votes_c: 0,
        }]
      };

      const response = await apperClient.createRecord('review_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create review");
        }
        return transformReview(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, reviewData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(reviewData.rating !== undefined && { rating_c: parseInt(reviewData.rating) }),
          ...(reviewData.title && { title_c: reviewData.title }),
          ...(reviewData.comment && { comment_c: reviewData.comment }),
          ...(reviewData.reviewerName && { reviewer_name_c: reviewData.reviewerName }),
          ...(reviewData.verified !== undefined && { verified_c: reviewData.verified }),
          ...(reviewData.helpfulVotes !== undefined && { helpful_votes_c: parseInt(reviewData.helpfulVotes) }),
        }]
      };

      const response = await apperClient.updateRecord('review_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update review");
        }
        return transformReview(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async voteHelpful(id) {
    try {
      const currentReview = await this.getById(id);
      return await this.update(id, {
        helpfulVotes: currentReview.helpfulVotes + 1
      });
    } catch (error) {
      console.error("Error voting helpful:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('review_c', {
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
          console.error(`Failed to delete review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete review");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error);
      throw error;
    }
  }
};