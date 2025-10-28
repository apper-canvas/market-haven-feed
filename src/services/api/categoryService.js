import categoriesData from '../mockData/categories.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all categories
export const getAll = async () => {
  try {
    await delay(300);
    return [...categoriesData];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default {
  getAll
};