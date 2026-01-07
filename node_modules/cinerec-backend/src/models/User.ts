import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  provider?: 'local' | 'google';
  passwordChangedAt?: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: function() {
      return this.provider === 'local';
    },
    select: false 
  },
  googleId: { type: String, unique: true, sparse: true },
  provider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  passwordChangedAt: { type: Date }
}, { timestamps: true });

// Hash password before saving (only for local provider)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  if (!this.password) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;