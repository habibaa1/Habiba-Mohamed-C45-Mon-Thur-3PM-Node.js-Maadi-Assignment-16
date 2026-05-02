import { GenderEnum, ProviderEnum, RoleEnum } from "../enums";

export interface IUser{
    firstName:string;
    lastName:string;
    username?:string;
    email:string;
    password:string;
    bio?:string;
    phone?:string;
    profilePicture?:string;
    coverImages?:string[];
    DOB?:Date;
    confirmEmail?:Date;
    confirmedAt?:Date;
    changeCredentialsTime:Date;
    gender:GenderEnum;
    role:RoleEnum;
    provider:ProviderEnum;

    createdAt:Date;
    updatedAt?:Date;

}