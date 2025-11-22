const fs = require('fs');
const path = require('path');

// Path to persistent database file
const dbPath = path.join(__dirname, 'reviews.json');

// Initialize or load existing reviews
let reviews = [];

const loadReviews = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      reviews = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading reviews from file:', error);
    reviews = [];
  }
};

const saveReviews = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving reviews to file:', error);
  }
};

// Load reviews on module initialization
loadReviews();

const reviewDB = {
  // Create new review
  async create(review) {
    const newReview = {
      id: Date.now().toString(),
      userId: review.userId,
      code: review.code,
      language: review.language,
      review: review.review,
      qualityScore: review.qualityScore || 0,
      complexity: review.complexity || { time: 'O(n)', space: 'O(1)' },
      timestamp: new Date().toISOString(),
      likes: 0
    };
    reviews.push(newReview);
    saveReviews();
    return newReview;
  },

  // Get all reviews for a user
  async getByUserId(userId) {
    return reviews
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get single review by ID
  async getById(id) {
    return reviews.find(r => r.id === id);
  },

  // Get all reviews (paginated)
  async getAll(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      reviews: reviews.slice(startIndex, endIndex),
      total: reviews.length,
      pages: Math.ceil(reviews.length / limit),
      currentPage: page
    };
  },

  // Delete review
  async delete(id) {
    const index = reviews.findIndex(r => r.id === id);
    if (index > -1) {
      reviews.splice(index, 1);
      saveReviews();
      return true;
    }
    return false;
  },

  // Update review (for likes, etc.)
  async update(id, updates) {
    const review = reviews.find(r => r.id === id);
    if (review) {
      Object.assign(review, updates);
      saveReviews();
      return review;
    }
    return null;
  }
};

module.exports = reviewDB;
