require("dotenv").config();
const axios = require("axios");
const logger = require("../utils/logger");
const { oauth2client } = require("../utils/googleConfig");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Ensure mongoose is required for ObjectId validation
const bcrypt = require("bcryptjs");
const User = require("../database/models/user-model");
const Admin = require("../database/models/admin-model");
const Vendor = require("../database/models/vendor-model");

// Helper to check profile completeness for user
function checkUserProfileComplete(user) {
  return !!(
    user.phone &&
    user.foodStallName &&
    user.address &&
    user.address.street &&
    user.location &&
    user.location.lat &&
    user.location.lng &&
    user.typeOfCuisine
  );
}
// Helper to check profile completeness for vendor
function checkVendorProfileComplete(vendor) {
  return !!(
    vendor.phone &&
    vendor.businessName &&
    vendor.address &&
    vendor.address.street &&
    vendor.location &&
    vendor.location.lat &&
    vendor.location.lng
  );
}

// =============================
// Manual Register
// =============================
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      foodStallName,
      address,
      location,
      typeOfCuisine,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isGoogleAccount: false,
      foodStallName,
      address,
      location,
      typeOfCuisine,
    });

    res.status(201).json({
      message: "User registered successfully",
      isProfileComplete: checkUserProfileComplete(user),
      user,
    });
  } catch (error) {
    logger.error("Register error", error);
    next(error);
  }
};

// =============================
// Manual Login
// =============================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user || user.isGoogleAccount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await user.generateToken();
    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id.toString(),
      isProfileComplete: checkUserProfileComplete(user),
      user,
    });
  } catch (error) {
    logger.error("Login error", error);
    next(error);
  }
};

// ----------------
// Sign In (Continue with Google)
// Sign up (Continue with Google)
// ------------------
const googleLogin = async (req, res, next) => {
  try {
    const { code } = req.query;
    // console.log('Code: ',code)
    if (!code) {
      return res.status(400).json({ message: "Missing code parameter." });
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    if (!email) {
      // console.log('Email not returned from Google');
      return res
        .status(400)
        .json({ message: "Email not returned from Google" });
    }

    let user = await User.findOne({ email });
    let token;
    if (!user) {
      user = await User.create({
        name: name,
        email,
        isGoogleAccount: true,
      });
      logger.info(`New Google user created: ${email}`);
    }
    if (user) {
      token = await user.generateToken();
      logger.info(`User logged in: ${email}`);
    }

    return res.status(200).json({
      message: "Google login successful",
      token,
      user,
      userId: user._id.toString(),
      isProfileComplete: checkUserProfileComplete(user),
    });
  } catch (error) {
    logger.error("Google login error", error);
    next(error);
  }
};

// Google Login for Food Stall Owners (User)
const googleLoginUser = async (req, res, next) => {
  try {
    const {
      email,
      name,
      picture,
      phone,
      foodStallName,
      address,
      location,
      typeOfCuisine,
    } = req.body;
    if (!email)
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is required from Google profile.",
        });
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isGoogleAccount) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "Account exists but not registered with Google. Use password login.",
          });
      }
      // Update missing fields if provided
      let updated = false;
      if (phone && !user.phone) {
        user.phone = phone;
        updated = true;
      }
      if (foodStallName && !user.foodStallName) {
        user.foodStallName = foodStallName;
        updated = true;
      }
      if (address && !user.address?.street) {
        user.address = address;
        updated = true;
      }
      if (location && !user.location?.lat) {
        user.location = location;
        updated = true;
      }
      if (typeOfCuisine && !user.typeOfCuisine) {
        user.typeOfCuisine = typeOfCuisine;
        updated = true;
      }
      if (updated) await user.save();
    } else {
      user = await User.create({
        name,
        email,
        isGoogleAccount: true,
        phone,
        foodStallName,
        address,
        location,
        typeOfCuisine,
      });
    }
    const token = await user.generateToken();
    return res.status(200).json({
      success: true,
      token,
      role: "user",
      isProfileComplete: user.isProfileComplete,
      user,
    });
  } catch (error) {
    logger.error("Google login user error", error);
    next(error);
  }
};

// Google Login for Ingredient Suppliers (Vendor)
const googleLoginVendor = async (req, res, next) => {
  try {
    const { email, name, picture, phone, businessName, address, location } =
      req.body;
    if (!email)
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is required from Google profile.",
        });
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      if (!vendor.isGoogleAccount) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "Account exists but not registered with Google. Use password login.",
          });
      }
      // Update missing fields if provided
      let updated = false;
      if (phone && !vendor.phone) {
        vendor.phone = phone;
        updated = true;
      }
      if (businessName && !vendor.businessName) {
        vendor.businessName = businessName;
        updated = true;
      }
      if (address && !vendor.address?.street) {
        vendor.address = address;
        updated = true;
      }
      if (location && !vendor.location?.lat) {
        vendor.location = location;
        updated = true;
      }
      if (updated) await vendor.save();
    } else {
      vendor = await Vendor.create({
        name,
        email,
        isGoogleAccount: true,
        phone,
        businessName,
        address,
        location,
      });
    }
    const token = await vendor.generateToken();
    return res.status(200).json({
      success: true,
      token,
      role: "vendor",
      isProfileComplete: vendor.isProfileComplete,
      vendor,
    });
  } catch (error) {
    logger.error("Google login vendor error", error);
    next(error);
  }
};

// Vendor Register
const registerVendor = async (req, res, next) => {
  try {
    const { name, email, phone, password, businessName, address, location } =
      req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({ message: "Vendor already exists." });
    }
    const vendor = await Vendor.create({
      name,
      email,
      phone,
      password,
      isGoogleAccount: false,
      businessName,
      address,
      location,
    });
    res.status(201).json({
      message: "Vendor registered successfully",
      isProfileComplete: checkVendorProfileComplete(vendor),
      vendor,
    });
  } catch (error) {
    logger.error("Vendor register error", error);
    next(error);
  }
};
// Vendor Login
const loginVendor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const vendor = await Vendor.findOne({ email });
    if (!vendor || vendor.isGoogleAccount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await vendor.generateToken();
    return res.status(200).json({
      message: "Login successful",
      token,
      vendorId: vendor._id.toString(),
      isProfileComplete: checkVendorProfileComplete(vendor),
      vendor,
    });
  } catch (error) {
    logger.error("Vendor login error", error);
    next(error);
  }
};

// ---------------------------
// GET Current Logged User detail
// ---------------------------

const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userID, role } = decoded;

    // Validate role and model mapping
    const roleModelMap = {
      user: User,
      admin: Admin,
      vendor: Vendor,
    };

    const model = roleModelMap[role];

    if (!model) {
      return res.status(400).json({ message: "Invalid user role in token" });
    }

    // Fetch user
    const userData = await model.findById(userID).select("-password");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    next(error);
  }
};

module.exports = {
  googleLogin,
  login,
  register,
  getCurrentUser,
  googleLoginUser,
  googleLoginVendor,
  registerVendor,
  loginVendor,
};
