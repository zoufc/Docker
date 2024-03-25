import { Document } from 'mongoose';

export interface User extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
