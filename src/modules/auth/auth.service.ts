// import { HydratedDocument } from "mongoose";
import { BadRequestExaption } from "../../common/exception";
import { UserModel } from "../../DB/model";
import { UserRepository } from "../../DB/repository/user.reposatory";
import { LoginDto, SignupDto } from "./auth.dto"
import { IUser } from "../../common/interfaces";
// import { ISignupResspones } from "./auth.entities"
// import { ApplicationExaption } from "../../common/exception"
export class AuthnticationService {
    private readonly userRepository: UserRepository
    constructor() {
            this.userRepository = new UserRepository(UserModel)

    }
// public login(data: any): string{

//     throw new ApplicationExaption("not implemented yet ", 400 ,{cause :{extra:"lol"}})

// }
    login =(data: LoginDto): string =>{
        console.log({this: this});
        return "Done login"
    }

    async signup (data: SignupDto): Promise<IUser>{
        let {username, email, password} = data 
        // console.log({username, email, password});
        // const user = await UserModel.create({
        //     username,
        //     email,  
        //     password

        // })
        const [user] = await this.userRepository.create({
            data:[{username,email,password}],
        }) || []
        if (!user){
            throw new BadRequestExaption("failed to create user")

        }

        return user.toJSON()
    }
}
export default new AuthnticationService()