"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const validation_1 = require("../../common/validation");
exports.login = {
    body: zod_1.z.strictObject({
        email: validation_1.generalValidationFielda.email,
        password: validation_1.generalValidationFielda.password
    })
};
exports.signup = {
    body: exports.login.body.safeExtend({
        username: validation_1.generalValidationFielda.username,
        confirmPassword: validation_1.generalValidationFielda.confirmPassword
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { message: "password and confirm password must be the same", })
};
