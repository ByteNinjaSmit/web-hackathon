const mongoose = require("mongoose");


const rejectVendor = new mongoose.Schema(
  {
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
    rejectionReason: {
        type: String,
        default: null,
    }
  },
  {
    timestamps: true,
  }
);

const RVendor = new mongoose.model("RVendor", rejectVendor);
module.exports = RVendor;
