"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErroHandler = void 0;
const globalErroHandler = (error, req, res, next) => {
    const status = error.statusCode || 500;
    return res.status(status).json({
        message: error.message || "internal server error",
        cause: error.cause,
        error: error,
        stack: error.stack
    });
};
exports.globalErroHandler = globalErroHandler;
