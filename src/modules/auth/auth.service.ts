// import { HydratedDocument } from "mongoose";
import { BadRequestExaption , ConflictExeption, NotFoundExeption } from "../../common/exception";
import { UserModel } from "../../DB/model";
import { UserRepository } from "../../DB/repository/user.reposatory";
import { LoginDto, SignupDto ,ConfirmEmailDto ,ResendConfirmEmailDto } from "./auth.dto"
import { IUser } from "../../common/interfaces";
import { compareHash, generateEncryption, generateHash } from "../../common/utils/security";
import { emailEvent, emailTemplate, sendEmail } from "../../common/utils/email";
import { redisService, RedisService } from "../../common/services";
import { EmailEnum, ProviderEnum } from "../../common/enums";
import { createRandomOtp } from "../../common/utils/otp";
// import { SecurityService } from "../../common/services";
// import { ISignupResspones } from "./auth.entities"
// import { ApplicationExaption } from "../../common/exception"
export class AuthnticationService {

    private readonly userRepository: UserRepository
    private readonly redis:RedisService
    // private readonly securityService: SecurityService
    constructor() {
            this.userRepository = new UserRepository(UserModel)
            this.redis = redisService
            // this.securityService = new SecurityService()

    }
// public login(data: any): string{

//     throw new ApplicationExaption("not implemented yet ", 400 ,{cause :{extra:"lol"}})

// }
    login =(data: LoginDto): string =>{
        console.log({this: this});
        return "Done login"
    }
private async sendEmailOtp ({email,subject, title}:{email:string,subject:EmailEnum,title:string}) {
        const isBlockedTTL = await this.redis.ttl (this.redis.blockOtpKey({email , subject}))
        if (isBlockedTTL > 0){
            throw new BadRequestExaption(`sorry we cannot request new otp while are blocked please try again after ${isBlockedTTL}`)
        }
        const remainingOtpTTL = await this.redis.ttl(this.redis.otpKey({email,subject}))
                if (remainingOtpTTL > 0){
            throw new BadRequestExaption(`sorry we cannot request new otp while are blocked please try again after ${remainingOtpTTL}`)
        }
        const maxtrial = await this.redis.get(this.redis.maxAttemptOtpKey({email,subject}))
        if (maxtrial >= 3){
            await this.redis.set({
                key:this.redis.blockOtpKey({email,subject}),
                value:1,
                ttl:7*60
            })
            throw new BadRequestExaption(`you have reached the max trial`)

        }
        const code = createRandomOtp()
        await this.redis.set({
            key:this.redis.otpKey({email,subject}),
            value:await generateHash({plaintext: `${code}`}),
            ttl:120
        })
        emailEvent.emit("sendEmail", async()=>{
            await sendEmail({
                to:email,
                subject,
                html:emailTemplate({code,title})
            })
            await this.redis.incr(this.redis.maxAttemptOtpKey({email,subject}))
        })
    }
    public async signup ({email , username ,password, phone}: SignupDto): Promise<IUser>{
        // let {username, email, password} = data 
        // console.log({username, email, password});
        // const user = await UserModel.create({
        //     username,
        //     email,  
        //     password

        // })
        const checkUserExist = await this.userRepository.findOne({
            filter:{email},
            projection:"email",
            options:{lean:false}
        })
        console.log({checkUserExist});
        if(checkUserExist){
            // checkUserExist.email="test";
            // await checkUserExist.save()
            throw new ConflictExeption("email already exist")
        }
        const user = await this.userRepository.createOne({
            data:{
                email,
                username,  
                password:await generateHash({plaintext: password}),
                phone:phone?await generateEncryption(phone):undefined
            }
        }) 
        if (!user){
            throw new BadRequestExaption("failed to create user")

        }
        this.sendEmailOtp({email,subject: EmailEnum.Confirm_Email,title:"verify Email"})
        return user.toJSON()
    }
///////////////////////////////////
    public async confirmEmail ( { email, otp }:ConfirmEmailDto) {

    const hashOtp = await this.redis.get(this.redis.otpKey({ email, subject: EmailEnum.Confirm_Email }))
    if (!hashOtp) {
        throw new NotFoundExeption("Expired otp" )
    }

    const account = await this.userRepository.findOne({
        filter: { email, confirmEmail: { $exists: false }, provider: ProviderEnum.SYSTEM }
    })
    if (!account) {
        throw new NotFoundExeption( "Fail to find matching account" )
    }

    if (!await compareHash({ plaintext: otp, ciphertext: hashOtp })) {
        throw new ConflictExeption( "Invalid otp" )
    }
(account as any).confirmEmail = new Date();    await account.save()

    await this.redis.deleteKey(await this.redis.Keys(this.redis.otpKey({ email })))
    
    return;
};

public async resendConfirmEmail ({email}:ResendConfirmEmailDto)  {

    const account = await this.userRepository.findOne({
        filter: { email, confirmEmail: { $exists: false }, provider: ProviderEnum.SYSTEM }
    })

    if (!account) {
        throw new NotFoundExeption("Fail to find matching account" )
    }

    await this.sendEmailOtp({ email, subject: EmailEnum.Confirm_Email, title: "Verify Email" })

    return;
};
}
export default new AuthnticationService()