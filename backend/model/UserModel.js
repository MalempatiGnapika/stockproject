const mongoose = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

// ✅ The model name "users" must be consistent.
// If you previously had a different model name like "User" or "user",
// MongoDB may have an old collection — drop it or keep name consistent.
const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
