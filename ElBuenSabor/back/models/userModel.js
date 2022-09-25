import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nombreUsuario: { type: String, required: true},
    emailUsuario: { type: String, required: true, unique: true },
    passwordUsuario: { type: String, required: true },
    isAdmin: {type: Boolean, default: false, required:true}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;