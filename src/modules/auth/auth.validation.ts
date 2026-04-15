import { z} from "zod";
import { generalValidationFielda } from "../../common/validation";

export const login ={
    body:z.strictObject({
        // email:z.email({error: "email is mandatory"}),
        email: generalValidationFielda.email,
        // password:z.string({error: "password is mandatory"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w).{8,16}$/, {error:"weak password"}),
        password: generalValidationFielda.password
    })
}

export const signup ={
    // params:z.strictObject({
    //     userId:z.string()
    // }),
    body:login.body.safeExtend({
        username: generalValidationFielda.username,
        confirmPassword: generalValidationFielda.confirmPassword 
        // username:z.string({error: "username is mandatory"}).min(2,{error:"min is 2 characters"}).max(25,{error:"max is 25 characters"}),
        // confirmPassword:z.string()
    }).refine((data) =>{
        return data.password === data.confirmPassword},
        {message:"password and confirm password must be the same",})
}
    // .superRefine((data,ctx)=>{
    //     if(data.password !== data.confirmPassword){
    //         ctx.addIssue({
    //             path:["confirmPassword"],
    //             message: "password and confirm password must be the same",
    //             code: "custom"})
    // .refine((data) =>{
    //     return data.password === data.confirmPassword},
    //     {message:"password and confirm password must be the same",})
// }