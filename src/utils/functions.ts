import { HttpException } from '@nestjs/common';
import { User } from 'src/api/user/interfaces/user.interface';

export async function sanitizeUser(user: User) {
  try {
    const sanitizeUser = {
      _id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
    return sanitizeUser;
  } catch (error) {
    throw new HttpException(error.message, error.status);
  }
}
