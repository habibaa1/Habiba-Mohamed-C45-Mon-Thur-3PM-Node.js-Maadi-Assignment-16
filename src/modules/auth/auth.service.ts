// import { HydratedDocument } from "mongoose";
import { BadRequestExaption , ConflictExeption } from "../../common/exception";
import { UserModel } from "../../DB/model";
import { UserRepository } from "../../DB/repository/user.reposatory";
import { LoginDto, SignupDto } from "./auth.dto"
import { IUser } from "../../common/interfaces";
import { generateEncryption, generateHash } from "../../common/utils/security";
import { emailTemplate, sendEmail } from "../../common/utils/email";
// import { SecurityService } from "../../common/services";
// import { ISignupResspones } from "./auth.entities"
// import { ApplicationExaption } from "../../common/exception"
export class AuthnticationService {
    private readonly userRepository: UserRepository
    // private readonly securityService: SecurityService
    constructor() {
            this.userRepository = new UserRepository(UserModel)
            // this.securityService = new SecurityService()

    }
// public login(data: any): string{

//     throw new ApplicationExaption("not implemented yet ", 400 ,{cause :{extra:"lol"}})

// }
    login =(data: LoginDto): string =>{
        console.log({this: this});
        return "Done login"
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
        await sendEmail({to: email, subject :"confirm your email", html:emailTemplate({code:123456,title:"verification code"})})

        return user.toJSON()
    }
}
export default new AuthnticationService()