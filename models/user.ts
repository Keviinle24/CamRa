import mongoose from "mongoose";

const emailTokenSchema = new mongoose.Schema(
    {
        token: {type: String, required: true, unique: true},
        created_at: {type: Date, default: Date.now, required: true},
        expired_at: {type: Date, default: Date.now, required: true},
    }
);

export const EmailToken = mongoose.models.user || mongoose.model('emailToken', emailTokenSchema);

const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        unique: true,
      },
      password: { type: String, required: true, minlength: 3, maxlength: 1024 },
      verified: {type:Boolean, required: true, default: false},
      university:{type: String, required: true},
      emailToken: {type: emailTokenSchema, required: true},
    },
    {
      timestamps: true,
    }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
