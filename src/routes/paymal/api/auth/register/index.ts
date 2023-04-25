import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../../../../models/User";
import connectMongoose from "../../../../../utils/connect-mongoose";
import Wallet from "../../../../../models/Wallet";
import { generateOtp } from "../../../../../utils/generateotp-ts";
import sendOtp from "../../../../../utils/send-otp";

export default brewBlankExpressFunc(async (req, res) => {
  await connectMongoose();
  const { name, phoneNumber, pin } = req.body;

  // Validate input
  if (!name || !phoneNumber || !pin) {
    throwErrorResponse(400, "Please provide all required fields");
  }

  // Check if the pin is valid (e.g., 6 digits)
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ message: "PIN must be 6 digits" });
  }

  // Check if the phone number already exists
  const existingUser = await User.findOne({ phoneNumber, otpVerified: true });
  if (existingUser) {
    throwErrorResponse(409, "Phone number already exists!");
  }

  // Create the new user
  const user = new User({
    name,
    phoneNumber,
    pin: await bcrypt.hash(pin, 10),
  });
  await user.save();

  // Create a new wallet for the user
  const wallet = new Wallet({
    balance: 0,
    transactions: [],
  });
  await wallet.save();

  // Associate the wallet with the user
  user.wallet = wallet._id;
  await user.save();

  // Generate the OTP token
  const otpDigits = 6;
  const otpExpiration = "2m"; // 2-minute expiration time
  const { otp, token } = generateOtp(
    otpDigits,
    otpExpiration,
    process.env.JWT_SECRET
  );
  sendOtp(phoneNumber, otp);

  res.status(201).json({
    code: 201,
    message: "Registration successful. OTP sent to the phone number.",
    data: {
      otpToken: token,
    },
  });
});
