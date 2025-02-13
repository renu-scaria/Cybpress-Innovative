var mongoose = require("mongoose");

var blogSchema = mongoose.Schema(
  {
    userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'
    },
    title: {
      type: String,
    },
    content:{
      type: String
    },
    photo:{
      type: String
    },
    status: {
      type: String,
      default: "Active", // Deleted
    },
  },
  {
    //timestamps: true
    timestamps: { createdAt: "create_date", updatedAt: "update_date" },
  }
);

module.exports = mongoose.model("BlogModel", blogSchema);
