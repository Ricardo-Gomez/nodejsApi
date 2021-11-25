const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const createMongoConnextion = require('./src/database/mongoConnection');
const { errorHandler } = require("./src/errors/errorHandler");
const { loadRoutes } = require("./src/routes/index");

const app = express();

createMongoConnextion();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
loadRoutes(app);
app.use(errorHandler);
module.exports = app;
