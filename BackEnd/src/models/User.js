const bcrypt = require('bcryptjs');

class User {
  constructor(email, password, name = '') {
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return this.password;
  }

  async comparePassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }
}

module.exports = User;
