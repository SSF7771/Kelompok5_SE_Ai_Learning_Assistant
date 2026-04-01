import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters long."]
    },

    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."]
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password must be at least 6 characters long."],
        select: false
    },

    profileImage: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) 
        return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password Method
userSchema.methods.matchPassword = async function (enteredPW) {
    return await bcrypt.compare(enteredPW, this.password);  
};

const User = mongoose.model('User', userSchema);

export default User;