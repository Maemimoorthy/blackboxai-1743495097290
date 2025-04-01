const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('error', err => {
  console.log(`MongoDB Connection Error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

module.exports = connectDB;