const fs = require('fs');
const path = require('path');

// Path to persistent database file
const dbPath = path.join(__dirname, 'users.json');

// Initialize or load existing users
let users = [];

const loadUsers = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      users = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users from file:', error);
    users = [];
  }
};

const saveUsers = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
};

// Load users on module initialization
loadUsers();

const userDB = {
  // Create new user
  async create(user) {
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    await user.hashPassword();
    users.push(user);
    saveUsers();
    return { id: users.length - 1, email: user.email, name: user.name, createdAt: user.createdAt };
  },

  // Find user by email (returns full user with password for auth)
  async findByEmail(email) {
    const user = users.find(u => u.email === email);
    if (user) {
      return {
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        comparePassword: async (plainPassword) => {
          const bcrypt = require('bcryptjs');
          return await bcrypt.compare(plainPassword, user.password);
        }
      };
    }
    return null;
  },

  // Find user by id
  async findById(id) {
    if (id < users.length) {
      const user = users[id];
      return { id, email: user.email, name: user.name, createdAt: user.createdAt };
    }
    return null;
  },

  // Get all users (for admin purposes)
  async getAll() {
    return users.map((user, index) => ({
      id: index,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }));
  },

  // Update user password (for password reset)
  async updatePassword(email, hashedPassword) {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    user.password = hashedPassword;
    saveUsers();
    return true;
  }
};

module.exports = userDB;
