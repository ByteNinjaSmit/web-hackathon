const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
    lowercase: true,
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
      country: String,
    },

  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
},
  foodStallName: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  typeOfCuisine: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    },
  },

});

userSchema.virtual('isProfileComplete').get(function () {
  return !!(this.phone && this.foodStallName && this.address && this.address.street && this.location && this.location.lat && this.location.lng && this.typeOfCuisine);
});

// secure the password

userSchema.pre("save", async function (next) {
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

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// json web token

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userID: this._id.toString(),
        email: this.email,
        role: "user",
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const User = new mongoose.model("Users", userSchema);
module.exports = User;
