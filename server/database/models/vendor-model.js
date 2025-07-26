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
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Coordinates must be [longitude, latitude] with valid ranges'
      }
    }
  },
  //   Add Address  related Fields
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
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

vendorSchema.virtual('isProfileComplete').get(function () {
  return !!(this.phone && this.businessName && this.address && this.address.street && this.location && this.location.coordinates && this.location.coordinates.length === 2);
});

const Vendor = new mongoose.model("Vendors", vendorSchema);
module.exports = Vendor;
