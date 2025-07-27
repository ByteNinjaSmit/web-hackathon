const jwt = require("jsonwebtoken");
const User = require("../database/models/user-model");
const Admin = require("../database/models/admin-model"); // Assuming Faculty model exists
const Vendor = require("../database/models/vendor-model");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  // if (token) {
  //   console.log("Token Recived: ", token);
  // }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const { userID, role } = isVerified; // Assuming `role` is part of token payload
    if (!userID || !role) {
      return res.status(401).json({ message: "Unauthorized. Invalid Token." });
    }
    // console.log("User ID:", userID);
    // Find the user based on role
    let model;

    if (role === "user") {
      model = User; // Use User model for regular users
    } else if (role === "vendor") {
      model = Vendor; // Use Faculty model for admins or high-authority users
    } else if (role === "admin") {
      model = Admin; // Use Faculty model for admins or high-authority users
    } else {
      return res.status(401).json({ error: "Authentication token not found" });
    }
    const userData = await model.findById({ _id: userID }).select("-password");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(userData)
    req.user = userData;
    req.token = token;
    req.userID = userData._id;
    // console.log("auth middleware passed");

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized. Invalid Token." });
  }
};

module.exports = authMiddleware;
