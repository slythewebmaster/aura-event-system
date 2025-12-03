require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aura_event_system';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@auraevents.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'maxyTech@143';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`Admin with email ${ADMIN_EMAIL} already exists.`);
      console.log('Updating password...');
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      console.log('Admin password updated successfully!');
      await mongoose.disconnect();
      return;
    }

    // Create new admin
    console.log(`Creating admin user with email: ${ADMIN_EMAIL}`);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = new User({
      email: ADMIN_EMAIL,
      passwordHash: passwordHash,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${ADMIN_EMAIL}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

