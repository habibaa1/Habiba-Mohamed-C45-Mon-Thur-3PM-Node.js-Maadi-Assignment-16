import {z} from 'zod'
export const generalValidationFielda = {
        email:z.email({error: "email is mandatory"}),
        password:z.string({error: "password is mandatory"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w).{8,16}$/, {error:"weak password"}),
        username:z.string({error: "username is mandatory"}).min(2,{error:"min is 2 characters"}).max(25,{error:"max is 25 characters"}),
        confirmPassword:z.string()
}