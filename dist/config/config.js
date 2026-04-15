"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URI = exports.PORT = void 0;
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)(`./.env.${process.env.NODE_ENV || "development"}`) });
exports.PORT = process.env.PORT;
exports.DB_URI = process.env.DB_URI;
