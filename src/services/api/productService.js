import productsData from "../mockData/products.json";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const productService = {
  async getAll() {
    await delay();
    return [...productsData];
  },

  async getById(id) {
    await delay();
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay();
    return productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  },

  async getFeatured() {
    await delay();
    return productsData.filter(p => p.featured === 1);
  },

  async search(query) {
    await delay();
    const searchTerm = query.toLowerCase();
    return productsData.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  async getRecommended(productId, limit = 4) {
    await delay();
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];

    // Get products from same category, excluding the current product
    const recommended = productsData
      .filter(p => p.Id !== parseInt(productId) && p.category === product.category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return recommended;
  },

  async create(productData) {
    await delay();
    const maxId = Math.max(...productsData.map(p => p.Id));
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay();
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    productsData[index] = { ...productsData[index], ...productData };
    return { ...productsData[index] };
  },

  async delete(id) {
    await delay();
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productsData.splice(index, 1)[0];
    return { ...deleted };
  }
};