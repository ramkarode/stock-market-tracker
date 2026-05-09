const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const { SuccessResponse, ErrorResponse } = require("../utils/responseHandlers");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: "stock-market-tracker-nine.vercel.app",
};

/**
 * @method POST
 * @endpoint /api/auth/signup
 * @description Register new user
 * @access Public
 * @payload { name, email, password }
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new ErrorResponse(res, "User already exists", {}, 400, true);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    return new SuccessResponse(
      res,
      "Signup successful",
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      201,
      true,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST
 * @endpoint /api/auth/login
 * @description Login user
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return new ErrorResponse(res, "Invalid credentials", {}, 400, true);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return new ErrorResponse(res, "Invalid credentials", {}, 400, true);
    }

    const token = generateToken(user._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    return new SuccessResponse(
      res,
      "Login successful",
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      200,
      true,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST
 * @endpoint /auth/logout
 * @description Logout current user
 * @access Private
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    return new SuccessResponse(res, "Logout successful", {}, 200, true);
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /auth/verify-login
 * @description Verify current logged in user
 * @access Private
 */
const verifyLogin = async (req, res, next) => {
  try {
    return new SuccessResponse(
      res,
      "User authenticated",
      {
        isAuthenticated: true,
        user: req.user,
      },
      200,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /api/auth/me
 * @description Get current logged in user
 * @access Private
 */
const getMe = async (req, res, next) => {
  try {
    return new SuccessResponse(
      res,
      "User fetched successfully",
      {
        user: req.user,
      },
      200,
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyLogin,
  getMe,
};
