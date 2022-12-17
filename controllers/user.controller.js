const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/asyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const db = require("../models/index.js");
const User = db.user;

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  const user = await User.findOne({ where: { email: email } }).catch((err) => {
    console.log("Error:", err);
  });
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 201, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  if (!req.cookies.token) {
    return next(new ErrorHandler("You are not logged in", 401));
  }
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  User.findOne({ where: { token: req.cookies.token } }).then((user) => {
    user.token = null;
    user.save();
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Metaverse Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    where: { resetPasswordToken: resetPasswordToken },
  });
  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  console.log(req.body.password);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(201).json({
    success: true,
    message: "Password updated successfully",
  });
});

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { token: req.cookies.token } });
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { token: req.cookies.token } });
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
  };
  const user = await User.findOne({ where: { token: req.cookies.token } });
  const isEmailTaken = await User.findOne({
    where: { email: req.body.email },
  });
  if (isEmailTaken && req.body.email !== user.email) {
    return next(new ErrorHandler("This email is already taken", 400));
  }
  await user.update(newUserData);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findAll();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findOne({ where: { id: req.params.id } });
  const isEmailTaken = await User.findOne({
    where: { email: req.body.email },
  });
  if (isEmailTaken && req.body.email !== user.email) {
    return next(new ErrorHandler("This email is already taken", 400));
  }
  await user.update(newUserData);
  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  if (!user)
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  await user.destroy();
  res.status(200).json({
    success: true,
  });
});
