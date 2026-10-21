import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";

export const authService = {
  async signup(
    name: string,
    email: string,
    password: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    const existingUser = await User.findOne({ where: { email: email } });
    // const { token, tokenHash, expiresAt } = createVerificationToken();

    if (existingUser) {
      throw new AppError(409, "User already registered.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Saves the new record through Sequelize.
    const user = await User.create({
      name: name.trim(),
      email: email,
      passwordHash,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: expiresAt,
      isEmailVerified: false,
    });

    return user;
  },
};
