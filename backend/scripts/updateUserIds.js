const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/igtc');

async function updateUserIds() {
  try {
    const users = await User.find({});
    
    for (const user of users) {
      const newUserId = Math.floor(Math.random() * 900000000 + 100000000).toString();
      await User.findByIdAndUpdate(user._id, { userId: newUserId });
      console.log(`Updated ${user.name}: ${user.userId} -> ${newUserId}`);
    }
    
    console.log('All user IDs updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserIds();