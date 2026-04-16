"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidationFields = void 0;
const zod_1 = require("zod");
exports.generalValidationFields = {
    email: zod_1.z.email({ error: "Invalid email address" }),
    password: zod_1.z.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/, { error: "Password is weak" }),
    phone: zod_1.z.string({ error: "Phone is required" })
        .regex(/^(00201|\+201|01)(0|1|2|5)\d{8}$/, {
        error: "Invalid Egyptian phone number"
    }),
    otp: zod_1.z.string({ error: "OTP is required" })
        .regex(/^\d{6}$/, {
        error: "OTP must be exactly 6 digits"
    }),
    username: zod_1.z.string({ error: "UserName is required" })
        .min(2, { error: "min is 2" })
        .max(20, { error: "max is 20" }),
    confirmPassword: zod_1.z.string({ error: "Confirm Password is required" }),
};
