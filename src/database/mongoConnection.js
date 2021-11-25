const mongoose = require("mongoose");

async function connectionFactory() {
  let conn;
  if (process.env.NODE_ENV === "development") {
    conn = await mongoose.connect(process.env.MONGODB_URI);
  } else {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      auth: {
        password: process.env.MONGODB_PASS,
        username: process.env.MONGODB_USER,
      },
    });
  }

  return conn;
};

module.exports = connectionFactory
