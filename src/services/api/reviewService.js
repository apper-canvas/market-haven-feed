import reviewsData from "../mockData/reviews.json";

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const reviewService = {
  async getAll() {
    await delay();
    return [...reviewsData];
  },

  async getById(id) {
    await delay();
    const review = reviewsData.find(r => r.Id === parseInt(id));
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  },

  async getByProductId(productId) {
    await delay();
    return reviewsData
      .filter(r => r.productId === productId.toString())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(reviewData) {
    await delay();
    const maxId = Math.max(...reviewsData.map(r => r.Id));
    const newReview = {
      Id: maxId + 1,
      date: new Date().toISOString(),
      verified: false,
      helpfulVotes: 0,
      ...reviewData
    };
    reviewsData.push(newReview);
    return { ...newReview };
  },

  async update(id, reviewData) {
    await delay();
    const index = reviewsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }
    reviewsData[index] = { ...reviewsData[index], ...reviewData };
    return { ...reviewsData[index] };
  },

  async voteHelpful(id) {
    await delay();
    const index = reviewsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }
    reviewsData[index].helpfulVotes += 1;
    return { ...reviewsData[index] };
  },

  async delete(id) {
    await delay();
    const index = reviewsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }
    const deleted = reviewsData.splice(index, 1)[0];
    return { ...deleted };
  }
};