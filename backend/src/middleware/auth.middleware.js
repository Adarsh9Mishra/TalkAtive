import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Decode token for debugging
    const decoded = jwt.decode(token);
    console.log("Decoded Token Payload:", decoded);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Token Missing User ID" });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Verified Token:", verified);

    const user = await User.findById(verified.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found or removed" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
