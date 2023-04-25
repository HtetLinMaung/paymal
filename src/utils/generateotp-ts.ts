import jwt from "jsonwebtoken";
import crypto from "crypto";

const default_secret = crypto.randomBytes(32).toString("hex");

export function generateOtp(
  digits: number,
  expiration: string | number | undefined = undefined,
  secret: string = ""
) {
  // Generate a random n-digit number
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1));

  // Create a payload containing the OTP
  const payload = { otp };

  // Encrypt the payload using JWT and set the desired expiration time
  const token = jwt.sign(payload, secret || default_secret, {
    expiresIn: expiration,
  });

  return { otp, token };
}

export interface DecodedOtpPayload {
  otp: number;
  iat: number;
  exp: number;
}

export function verifyOtp(
  otp: number,
  token: string,
  secret: string = ""
): boolean {
  try {
    // Verify and decode the OTP token using JWT
    const decodedPayload = jwt.verify(
      token,
      secret || default_secret
    ) as DecodedOtpPayload;

    // Check if the user-provided OTP matches the OTP in the payload
    if (decodedPayload.otp === otp) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during OTP verification", error);
    return false;
  }
}
