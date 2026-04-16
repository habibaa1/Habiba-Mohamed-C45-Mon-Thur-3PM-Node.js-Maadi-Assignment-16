import { z } from 'zod';

export const generalValidationFields = {
    email: z.email({ error: "Invalid email address" }),

    password: z.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/,
            {error: "Password is weak"}),

    phone: z.string({ error: "Phone is required" })
        .regex(/^(00201|\+201|01)(0|1|2|5)\d{8}$/, {
            error: "Invalid Egyptian phone number"
        }),

    otp: z.string({ error: "OTP is required" })
        .regex(/^\d{6}$/, {
            error: "OTP must be exactly 6 digits"
        }),

    username: z.string({ error: "UserName is required" })
        .min(2, { error: "min is 2" })
        .max(20, { error: "max is 20" }),

    confirmPassword: z.string({ error: "Confirm Password is required" }),
};