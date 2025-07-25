const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },
  isGoogleAccount: {
    type: Boolean,
    default: false,
  },
    //   Add Address  related Fields
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
  },


});

// secure the password

vendorSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

// Compare bcrypt password

vendorSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// json web token

vendorSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userID: this._id.toString(),
        email: this.email,
        role: "vendor",
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1D",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const Vendor = new mongoose.model("Vendors", vendorSchema);
module.exports = Vendor;
