"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidationFielda = void 0;
const zod_1 = require("zod");
exports.generalValidationFielda = {
    email: zod_1.z.email({ error: "email is mandatory" }),
    password: zod_1.z.string({ error: "password is mandatory" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w).{8,16}$/, { error: "weak password" }),
    username: zod_1.z.string({ error: "username is mandatory" }).min(2, { error: "min is 2 characters" }).max(25, { error: "max is 25 characters" }),
    confirmPassword: zod_1.z.string()
};
