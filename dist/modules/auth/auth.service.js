"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthnticationService = void 0;
const exception_1 = require("../../common/exception");
const model_1 = require("../../DB/model");
const user_reposatory_1 = require("../../DB/repository/user.reposatory");
const security_1 = require("../../common/utils/security");
const email_1 = require("../../common/utils/email");
class AuthnticationService {
    userRepository;
    constructor() {
        this.userRepository = new user_reposatory_1.UserRepository(model_1.UserModel);
    }
    login = (data) => {
        console.log({ this: this });
        return "Done login";
    };
    async signup({ email, username, password, phone }) {
        const checkUserExist = await this.userRepository.findOne({
            filter: { email },
            projection: "email",
            options: { lean: false }
        });
        console.log({ checkUserExist });
        if (checkUserExist) {
            throw new exception_1.ConflictExeption("email already exist");
        }
        const user = await this.userRepository.createOne({
            data: {
                email,
                username,
                password: await (0, security_1.generateHash)({ plaintext: password }),
                phone: phone ? await (0, security_1.generateEncryption)(phone) : undefined
            }
        });
        if (!user) {
            throw new exception_1.BadRequestExaption("failed to create user");
        }
        await (0, email_1.sendEmail)({ to: email, subject: "confirm your email", html: (0, email_1.emailTemplate)({ code: 123456, title: "verification code" }) });
        return user.toJSON();
    }
}
exports.AuthnticationService = AuthnticationService;
exports.default = new AuthnticationService();
