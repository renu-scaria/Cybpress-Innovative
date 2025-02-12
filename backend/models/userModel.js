var mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      default: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    photo: {
      type: String,
    },
    address: {
      type: String,
    },
    dob: {
      type: String,
    },
    status: {
      type: String,
      default: "Active", //Pending, Active, Inactive, Rejected, Deleted
    },
  },
  {
    //timestamps: true
    timestamps: { createdAt: "create_date", updatedAt: "update_date" },
  }
);

module.exports = mongoose.model("UserModel", userSchema);
