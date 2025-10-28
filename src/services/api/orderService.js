import ordersData from "../mockData/orders.json";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const orderService = {
  async getAll() {
    await delay();
    return [...ordersData].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  },

  async getById(id) {
    await delay();
    const order = ordersData.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async getByOrderId(orderId) {
    await delay();
    const order = ordersData.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay();
    const maxId = Math.max(...ordersData.map(o => o.Id));
    const orderNumber = `MH-${new Date().getFullYear()}-${String(maxId + 1).padStart(3, '0')}`;
    
    const newOrder = {
      Id: maxId + 1,
      orderId: orderNumber,
      orderDate: new Date().toISOString(),
      status: "processing",
      trackingNumber: null,
      ...orderData
    };
    
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay();
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { ...ordersData[index], ...orderData };
    return { ...ordersData[index] };
  },

  async updateStatus(id, status) {
    await delay();
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index].status = status;
    
    // Generate tracking number when status changes to shipped
    if (status === "shipped" && !ordersData[index].trackingNumber) {
      ordersData[index].trackingNumber = `1Z999${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    
    return { ...ordersData[index] };
  },

  async delete(id) {
    await delay();
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deleted = ordersData.splice(index, 1)[0];
    return { ...deleted };
  }
};