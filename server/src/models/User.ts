import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret: any) {
      if (ret.passwordHash !== undefined) {
        delete ret.passwordHash;
      }
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function (_doc, ret: any) {
      if (ret.passwordHash !== undefined) {
        delete ret.passwordHash;
      }
      return ret;
    }
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    (this as any)['passwordHash'] = await bcrypt.hash((this as any)['passwordHash'], salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
(UserSchema.methods as any).comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, (this as any)['passwordHash']);
};

// Indexes
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
