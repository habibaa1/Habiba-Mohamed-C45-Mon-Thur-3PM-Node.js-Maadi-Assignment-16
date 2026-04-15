import { GenderEnum, RoleEnum } from "../enums";

export interface IUser{
    firstName:string;
    lastName:string;
    username?:string;
    email:string;
    password:string;
    bio?:string;
    phone?:string;
    profileImage?:string;
    coverImages?:string[];
    DOB?:Date;
    confirmedAt?:Date;
    gender:GenderEnum;
    role:RoleEnum;

    createdAt:Date;
    updatedAt?:Date;

}