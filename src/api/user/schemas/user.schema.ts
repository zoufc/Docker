import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { logger } from 'src/utils/logger/logger';

export const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const preSaveHook = async function (next) {
  const user = this as any;
  if (!user.isModified('password')) {
    return next();
  }

  try {
    logger.info(`--- CRYPTING PASSWORD ---`);
    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS),
    );
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
};

UserSchema.pre('save', preSaveHook);
// UserSchema.pre('create', preSaveHook);
// UserSchema.pre('update', preSaveHook);
