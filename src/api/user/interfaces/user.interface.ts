import { Document } from 'mongoose';

export interface User extends Document {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
}
