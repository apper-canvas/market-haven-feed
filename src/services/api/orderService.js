import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

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

const transformOrder = (order) => {
  if (!order) return null;
  return {
    Id: order.Id,
    orderId: order.order_id_c || '',
    orderDate: order.order_date_c || new Date().toISOString(),
    status: order.status_c || 'processing',
    items: parseArrayField(order.items_c),
    subtotal: parseFloat(order.subtotal_c) || 0,
    tax: parseFloat(order.tax_c) || 0,
    shipping: parseFloat(order.shipping_c) || 0,
    total: parseFloat(order.total_c) || 0,
    paymentMethod: order.payment_method_c || '',
    shippingAddress: parseObjectField(order.shipping_address_c),
    trackingNumber: order.tracking_number_c || null,
  };
};

export const orderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          { field: { Name: "order_id_c" } },
          { field: { Name: "order_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "subtotal_c" } },
          { field: { Name: "tax_c" } },
          { field: { Name: "shipping_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "payment_method_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "tracking_number_c" } },
        ],
        orderBy: [{ fieldName: "order_date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(transformOrder);
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('order_c', parseInt(id), {
        fields: [
          { field: { Name: "order_id_c" } },
          { field: { Name: "order_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "subtotal_c" } },
          { field: { Name: "tax_c" } },
          { field: { Name: "shipping_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "payment_method_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "tracking_number_c" } },
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Order not found");
      }

      return transformOrder(response.data);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByOrderId(orderId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          { field: { Name: "order_id_c" } },
          { field: { Name: "order_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "subtotal_c" } },
          { field: { Name: "tax_c" } },
          { field: { Name: "shipping_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "payment_method_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "tracking_number_c" } },
        ],
        where: [{
          FieldName: "order_id_c",
          Operator: "EqualTo",
          Values: [orderId]
        }],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error("Order not found");
      }

      return transformOrder(response.data[0]);
    } catch (error) {
      console.error(`Error fetching order by orderId ${orderId}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      // Generate order number
      const orderNumber = `MH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const payload = {
        records: [{
          order_id_c: orderNumber,
          order_date_c: new Date().toISOString(),
          status_c: orderData.status || "processing",
          items_c: JSON.stringify(orderData.items || []),
          subtotal_c: parseFloat(orderData.subtotal) || 0,
          tax_c: parseFloat(orderData.tax) || 0,
          shipping_c: parseFloat(orderData.shipping) || 0,
          total_c: parseFloat(orderData.total) || 0,
          payment_method_c: orderData.paymentMethod || '',
          shipping_address_c: JSON.stringify(orderData.shippingAddress || {}),
          tracking_number_c: orderData.trackingNumber || null,
        }]
      };

      const response = await apperClient.createRecord('order_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create order");
        }
        return transformOrder(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(orderData.status && { status_c: orderData.status }),
          ...(orderData.items && { items_c: JSON.stringify(orderData.items) }),
          ...(orderData.subtotal !== undefined && { subtotal_c: parseFloat(orderData.subtotal) }),
          ...(orderData.tax !== undefined && { tax_c: parseFloat(orderData.tax) }),
          ...(orderData.shipping !== undefined && { shipping_c: parseFloat(orderData.shipping) }),
          ...(orderData.total !== undefined && { total_c: parseFloat(orderData.total) }),
          ...(orderData.paymentMethod && { payment_method_c: orderData.paymentMethod }),
          ...(orderData.shippingAddress && { shipping_address_c: JSON.stringify(orderData.shippingAddress) }),
          ...(orderData.trackingNumber !== undefined && { tracking_number_c: orderData.trackingNumber }),
        }]
      };

      const response = await apperClient.updateRecord('order_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update order");
        }
        return transformOrder(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        throw new Error("Service not available");
      }

      const updateData = { status_c: status };
      
      // Generate tracking number when status changes to shipped
      if (status === "shipped") {
        const currentOrder = await this.getById(id);
        if (!currentOrder.trackingNumber) {
          updateData.tracking_number_c = `1Z999${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await apperClient.updateRecord('order_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update order status:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update order status");
        }
        return transformOrder(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('order_c', {
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
          console.error(`Failed to delete order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete order");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error);
throw error;
    }
  }
};