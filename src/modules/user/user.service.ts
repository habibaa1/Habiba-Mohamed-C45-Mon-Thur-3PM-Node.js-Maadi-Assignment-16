
import { HydratedDocument } from "mongoose";
import { IUser } from "../../common/interfaces";
import { LogOutEnum } from "../../common/enums";
import { redisService, RedisService, TokenService } from "../../common/services";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../config/config";
import { ConflictExeption } from "../../common/exception";


class UserService{
    private readonly redis:RedisService
    private readonly tokenService:TokenService
    constructor(){
        this.redis=redisService
        this.tokenService = new TokenService()
    }
    async profile(user:HydratedDocument<IUser>):Promise<any>{
        return user.toJSON()
    }
    async logout  ({ flag }:{flag:LogOutEnum}, user:HydratedDocument<IUser>, { jti, iat, sub }:{jti:string,iat:number,sub:string}):Promise<number> {
    let status = 200;

    switch (flag) {
        case LogOutEnum.ALL:
            user.changeCredentialsTime = new Date();
            await user.save();
            
            await this.redis.deleteKey(await this.redis.Keys(this.redis.baseRevokeTokenKey(sub)));
            break;

        default:
            await this.tokenService.createRevokeToken({
                userId: sub,
                jti,
                ttl: iat + REFRESH_TOKEN_EXPIRES_IN
            });
            status = 201;
            break;
    }

    return status;
};
async rotateToken  (user:HydratedDocument<IUser>, { sub, jti, iat }:{jti:string,iat:number,sub:string}, issuer:string) {
    if ((iat + ACCESS_TOKEN_EXPIRES_IN) * 1000 >= Date.now() + (30000)) {
        throw new ConflictExeption( "Current access token still valid" );
    }

    await  this.tokenService.createRevokeToken({
        userId: sub,
        jti,
        ttl: iat + REFRESH_TOKEN_EXPIRES_IN
    });

    return await this.tokenService.createLoginCredentials(user, issuer);
};
}
export default new UserService() 