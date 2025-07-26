const Vendor = require("../database/models/vendor-model");
const RVendor = require("../database/models/rejected-vendors-model");

const getUnverifiedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVendor: false }).select("-password");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getverifiedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVendor: true }).select("-password");
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
    vendor.isVendor = true;
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

    await rejectedVendor.save();
    await vendor.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Vendor rejected successfully." });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getUnverifiedVendors,
  approveVendor,
  rejectVendor,
  getverifiedVendors,
  getRejectedVendors,
};
