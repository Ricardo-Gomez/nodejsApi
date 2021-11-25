const users = require('./users');

exports.loadRoutes = (app) => {
  app.use("/api/users", users);
}

