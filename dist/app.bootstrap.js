"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middleware_1 = require("./modules/middleware");
const connections_db_1 = require("./DB/connections.db");
const config_1 = require("./config/config");
const services_1 = require("./common/services");
const cors_1 = __importDefault(require("cors"));
const bootstrap = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json(), cors_1.default);
    app.get("/", (req, res, next) => {
        res.status(200).json({ message: "landing page" });
    });
    app.use("/auth", modules_1.authRouter);
    app.use("/user", modules_1.userRouter);
    app.use(middleware_1.globalErroHandler);
    app.get("/*dummy", (req, res, next) => {
        res.status(404).json({ message: "invalid route" });
    });
    app.listen(config_1.PORT, () => {
        console.log(`Server is running on port ${config_1.PORT}👌`);
    });
    await (0, connections_db_1.connectDB)();
    await services_1.redisService.connect();
};
exports.bootstrap = bootstrap;
