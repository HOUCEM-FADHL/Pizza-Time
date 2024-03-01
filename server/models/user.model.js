// Import the mongoose library
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
    {
        firstName: {
        type: String,
        required: [true, "First name is required"],
        },
        lastName: {
        type: String,
        required: [true, "Last name is required"],
        },
        email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [isEmail, "Please provide a valid email address"],
        },
        password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        },
    },
    { timestamps: true }
    );

    UserSchema.virtual("confirmPassword")
    .get(() => this._confirmPassword)
    .set((value) => {
        this._confirmPassword = value;
    });

    UserSchema.pre("validate", function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate("confirmPassword", "Passwords do not match");
    } else {
        next();
    }
    });

    UserSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;
        next();
    });
});

// Create the User model using the defined schema
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
