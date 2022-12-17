const catchAsyncErrors = require("../middleware/asyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const db = require("../models/index.js");
const jwt = require("jsonwebtoken");
const User = db.user;

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  next();
});

exports.authorizeRoles = (...roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.cookies.token) {
      return next(new ErrorHandler("Login first to access this resource", 401));
    }
    const user = await User.findOne({ where: { token: req.cookies.token } });
    if (!roles.includes(user.role)) {
      return next(
        new ErrorHandler(
          `Role (${user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  });
};
