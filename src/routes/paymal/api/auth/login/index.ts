import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import User from "../../../../../models/User";
import connectMongoose from "../../../../../utils/connect-mongoose";
import { generateOtp } from "../../../../../utils/generateotp-ts";
import sendOtp from "../../../../../utils/send-otp";

export default brewBlankExpressFunc(async (req, res) => {
  await connectMongoose();
  const { phoneNumber } = req.body;

  // Validate input
  if (!phoneNumber) {
    throwErrorResponse(400, "Please provide a phone number");
  }

  // Check if the phone number exists
  const existingUser = await User.findOne({
    phoneNumber,
    otpVerified: true,
  });
  if (!existingUser) {
    throwErrorResponse(404, "User not found");
  }

  // Generate the OTP token
  const otpDigits = 6;
  const otpExpiration = "2m"; // 2-minute expiration time
  const { otp, token } = generateOtp(
    otpDigits,
    otpExpiration,
    process.env.JWT_SECRET
  );

  // Send the OTP to the user via your preferred method (e.g., SMS)
  sendOtp(phoneNumber, otp);

  res.status(200).json({
    code: 200,
    message: "Login OTP sent to the phone number.",
    data: {
      otpToken: token, // Include the OTP token in the response
    },
  });
});
