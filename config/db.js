const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables (MONGO_URI)
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern mongoose defaults are optimal; options can be placed here if needed
    });

    console.log(`========================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`========================================`);
  } catch (error) {
    console.error(`========================================`);
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.error(` Please verify:`);
    console.error(` 1. MONGO_URI in .env is correct`);
    console.error(` 2. Network access (IP whitelist) allows 0.0.0.0/0 in MongoDB Atlas`);
    console.error(` 3. Database user credentials (username and password) are valid`);
    console.error(`========================================`);
    // Do not terminate process in test environment, but exit in production if needed
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
