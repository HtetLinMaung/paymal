import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import jwt from "jsonwebtoken";
import User from "../../../../../models/User";
import connectMongoose from "../../../../../utils/connect-mongoose";
import { verifyOtp } from "../../../../../utils/generateotp-ts";

export default brewBlankExpressFunc(async (req, res) => {
  await connectMongoose();
  const { otp, otpToken, phoneNumber, action } = req.body;

  // Validate input
  if (!otp || !otpToken || !phoneNumber || !action) {
    throwErrorResponse(400, "Please provide all required fields");
  }

  if (!["register", "login"].includes(action)) {
    throwErrorResponse(400, "Invalid action. Must be 'register' or 'login'.");
  }

  // Verify the OTP
  const isValidOtp = verifyOtp(Number(otp), otpToken, process.env.JWT_SECRET);
  if (!isValidOtp) {
    throwErrorResponse(400, "Invalid or expired OTP");
  }

  // Find the user with the provided phone number
  const user = await User.findOne({ phoneNumber, otpVerified: false });
  if (!user) {
    throwErrorResponse(404, "User not found");
  }

  // If the action is 'register', mark the OTP as verified
  if (action === "register") {
    user.otpVerified = true;
    await user.save();
  }

  // Generate an authentication token
  const payload = { userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // Set the token expiration time as needed

  res.json({
    code: 200,
    message: `OTP verification successful for '${action}' action.`,
    data: {
      token,
      user,
    },
  });
});
