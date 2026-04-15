"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthnticationService = void 0;
const exception_1 = require("../../common/exception");
const model_1 = require("../../DB/model");
const user_reposatory_1 = require("../../DB/repository/user.reposatory");
class AuthnticationService {
    userRepository;
    constructor() {
        this.userRepository = new user_reposatory_1.UserRepository(model_1.UserModel);
    }
    login = (data) => {
        console.log({ this: this });
        return "Done login";
    };
    async signup(data) {
        let { username, email, password } = data;
        const [user] = await this.userRepository.create({
            data: [{ username, email, password }],
        }) || [];
        if (!user) {
            throw new exception_1.BadRequestExaption("failed to create user");
        }
        return user.toJSON();
    }
}
exports.AuthnticationService = AuthnticationService;
exports.default = new AuthnticationService();
