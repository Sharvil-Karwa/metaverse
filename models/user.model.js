const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your name",
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
        validate: {
          notNull: {
            msg: "Please enter your email",
          },
          isEmail: {
            args: true,
            msg: "Please enter a valid email address",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your password",
          },
          len: {
            args: [6, 42],
            msg: "Password must be at least 6 characters",
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            msg: "Password must have an uppercase letter, a lowercase letter, a number, and a special character",
          },
        },
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "user",
      },
      token: {
        type: Sequelize.STRING,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      resetPasswordExpire: {
        type: Sequelize.DATE,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  };

  User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  User.prototype.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

  return User;
};
