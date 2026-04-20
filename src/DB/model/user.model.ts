import { model, models, Schema } from "mongoose";


import { IUser } from "../../common/interfaces";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums";


const userSchema = new Schema<IUser>({
    firstName:{ type: String, required: true },
    lastName:{ type: String, required: true },    
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true },
    bio:{ type: String, maxlength: 200 },
    phone:{ type: String, required: false },
    profileImage:{ type: String, required: false },
    coverImages:{ type: String, required: false },
    DOB:{ type: Date, required: false },
    confirmedAt:{ type: Date, required: false },
    changeCredentialsTime:{type:Date},

    gender:{ type: Number, enum:GenderEnum, default: GenderEnum.FEMALE},
    role:{ type: Number, enum:RoleEnum, default: RoleEnum.USER},
    provider:{type:Number,enum:ProviderEnum,default:ProviderEnum.SYSTEM}
    
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    collection:"social_App_users",
    toObject:{virtuals:true},
    toJSON:{virtuals:true}

})

userSchema.virtual("username").get(function(this:IUser){
    return `${this.firstName} ${this.lastName}`
}).set(function(this:IUser, value:string){
    const [firstName, lastName] = value.split(" ")
    this.firstName = firstName as string;
    this.lastName = lastName as string;
})
export const UserModel =models.User || model<IUser>("User", userSchema)