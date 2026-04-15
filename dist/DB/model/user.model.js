"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../common/enums");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, maxlength: 200 },
    phone: { type: String, required: false },
    profileImage: { type: String, required: false },
    coverImages: { type: String, required: false },
    DOB: { type: Date, required: false },
    confirmedAt: { type: Date, required: false },
    gender: { type: Number, enum: enums_1.GenderEnum, default: enums_1.GenderEnum.FEMALE },
    role: { type: Number, enum: enums_1.RoleEnum, default: enums_1.RoleEnum.USER }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    collection: "social_App_users",
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
}).set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
