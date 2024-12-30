const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log("Login attempt for email:", email); // untuk debugging

      const user = await User.findOne({ email });

      if (!user) {
        console.log("User not found"); // untuk debugging
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        console.log("Invalid password"); // untuk debugging
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username || email.split("@")[0],
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat login",
      });
    }
  },
};

module.exports = authController;
