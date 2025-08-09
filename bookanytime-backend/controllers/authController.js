const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Wishlist = require("../models/Wishlist");


exports.signup = async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // ✅ Log request body

    const { fullName, email,phone, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ fullName, email,phone, password: hashedPassword, role: "user" });
    await user.save();

    // ✅ Create default "Favourites" wishlist for this user
    await Wishlist.create({
      name: "Favourites",
      userId: user._id,
      properties: []
    });


    res.status(201).json({ message: "Signup successful. Please login." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, // ✅ Include isAdmin
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Check if isAdmin exists before sending the response
    console.log("User Found:", user);
    console.log("isAdmin Value:", user.isAdmin);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phone,
        isAdmin: user.isAdmin, // ✅ This should now be sent properly
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
