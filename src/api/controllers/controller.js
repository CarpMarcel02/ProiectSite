const errorController = require("./errorController");
const { authController } = require("./authController");
const userController = require("./userController");

const AppError = require("../utils/appError");

const apiRequest = (req, res) => {
  const url = req.url;
  if (url.startsWith("/api/auth")) {
    authController(req, res);
  } else if (url.startsWith("/api/users")) {
    userController(req, res);
  } else {
    errorController(res, new AppError("Not found", 404));
  }
};
module.exports = apiRequest;