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
  businessName: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },
  // Updated location field to use GeoJSON format
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  fssaiNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have a null value for this field
    trim: true,
  },
  gstNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  businessLicense: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },

  //   Add Address  related Fields
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  isVendor: {
    type: Boolean,
    default: true,
  },
});

// Add 2dsphere index for geospatial queries
vendorSchema.index({ location: "2dsphere" });

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

// To Check Profile is Completed or not
vendorSchema.virtual("isProfileComplete").get(function () {
  return !!(
    this.phone &&
    this.businessName &&
    this.address &&
    this.address.street &&
    this.location &&
    typeof this.location.lat === 'number' &&
    typeof this.location.lng === 'number'
  );
});


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
