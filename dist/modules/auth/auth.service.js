"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthnticationService = void 0;
const exception_1 = require("../../common/exception");
const model_1 = require("../../DB/model");
const user_reposatory_1 = require("../../DB/repository/user.reposatory");
const security_1 = require("../../common/utils/security");
const email_1 = require("../../common/utils/email");
const services_1 = require("../../common/services");
const enums_1 = require("../../common/enums");
const otp_1 = require("../../common/utils/otp");
class AuthnticationService {
    userRepository;
    redis;
    constructor() {
        this.userRepository = new user_reposatory_1.UserRepository(model_1.UserModel);
        this.redis = services_1.redisService;
    }
    login = (data) => {
        console.log({ this: this });
        return "Done login";
    };
    async sendEmailOtp({ email, subject, title }) {
        const isBlockedTTL = await this.redis.ttl(this.redis.blockOtpKey({ email, subject }));
        if (isBlockedTTL > 0) {
            throw new exception_1.BadRequestExaption(`sorry we cannot request new otp while are blocked please try again after ${isBlockedTTL}`);
        }
        const remainingOtpTTL = await this.redis.ttl(this.redis.otpKey({ email, subject }));
        if (remainingOtpTTL > 0) {
            throw new exception_1.BadRequestExaption(`sorry we cannot request new otp while are blocked please try again after ${remainingOtpTTL}`);
        }
        const maxtrial = await this.redis.get(this.redis.maxAttemptOtpKey({ email, subject }));
        if (maxtrial >= 3) {
            await this.redis.set({
                key: this.redis.blockOtpKey({ email, subject }),
                value: 1,
                ttl: 7 * 60
            });
            throw new exception_1.BadRequestExaption(`you have reached the max trial`);
        }
        const code = (0, otp_1.createRandomOtp)();
        await this.redis.set({
            key: this.redis.otpKey({ email, subject }),
            value: await (0, security_1.generateHash)({ plaintext: `${code}` }),
            ttl: 120
        });
        email_1.emailEvent.emit("sendEmail", async () => {
            await (0, email_1.sendEmail)({
                to: email,
                subject,
                html: (0, email_1.emailTemplate)({ code, title })
            });
            await this.redis.incr(this.redis.maxAttemptOtpKey({ email, subject }));
        });
    }
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
        this.sendEmailOtp({ email, subject: enums_1.EmailEnum.Confirm_Email, title: "verify Email" });
        return user.toJSON();
    }
    async confirmEmail({ email, otp }) {
        const hashOtp = await this.redis.get(this.redis.otpKey({ email, subject: enums_1.EmailEnum.Confirm_Email }));
        if (!hashOtp) {
            throw new exception_1.NotFoundExeption("Expired otp");
        }
        const account = await this.userRepository.findOne({
            filter: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.SYSTEM }
        });
        if (!account) {
            throw new exception_1.NotFoundExeption("Fail to find matching account");
        }
        if (!await (0, security_1.compareHash)({ plaintext: otp, ciphertext: hashOtp })) {
            throw new exception_1.ConflictExeption("Invalid otp");
        }
        account.confirmEmail = new Date();
        await account.save();
        await this.redis.deleteKey(await this.redis.Keys(this.redis.otpKey({ email })));
        return;
    }
    ;
    async resendConfirmEmail({ email }) {
        const account = await this.userRepository.findOne({
            filter: { email, confirmEmail: { $exists: false }, provider: enums_1.ProviderEnum.SYSTEM }
        });
        if (!account) {
            throw new exception_1.NotFoundExeption("Fail to find matching account");
        }
        await this.sendEmailOtp({ email, subject: enums_1.EmailEnum.Confirm_Email, title: "Verify Email" });
        return;
    }
    ;
}
exports.AuthnticationService = AuthnticationService;
exports.default = new AuthnticationService();
