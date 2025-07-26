const Vendor = require("../database/models/vendor-model");
const RVendor = require("../database/models/rejected-vendors-model");
const Admin = require("../database/models/admin-model");

const getUnverifiedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: false }).select(
      "-password"
    );
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getverifiedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: true }).select("-password");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getRejectedVendors = async (req, res) => {
  try {
    const vendors = await RVendor.find({}).select("-password");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const approveVendor = async (req, res) => {
  try {
    const { supplierId } = req.body;

    // Use findOne or findById
    const vendor = await Vendor.findById(supplierId).select("-password");

    if (!vendor) {
      console;
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found." });
    }
    vendor.isVerified = true;
    await vendor.save();
    res
      .status(200)
      .json({ success: true, message: "Vendor approved successfully", vendor });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { supplierId, reason = "No reason provided" } = req.body;

    const vendor = await Vendor.findById(supplierId);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found." });
    }

    const rejectedVendor = new RVendor({
      ...vendor.toObject(),
      rejectionReason: reason,
      rejectDate: new Date(),
    });

    vendor.isRejected = true;

    await rejectedVendor.save();
    await vendor.save();

    res
      .status(200)
      .json({ success: true, message: "Vendor rejected successfully." });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(409).json({ message: "Admin already exists." });

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const removeVendor = async (req, res) => {
  try {
    const { supplierId } = req.body;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required.",
      });
    }
    const deletedVendor = await Vendor.findByIdAndDelete(supplierId);

    if (!deletedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
      data: deletedVendor, 
    });
  } catch (error) {
    console.error("Error removing vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getUnverifiedVendors,
  approveVendor,
  removeVendor,
  rejectVendor,
  getverifiedVendors,
  getRejectedVendors,
  registerAdmin,
};
