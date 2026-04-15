import {  Router,type Request,type Response } from "express";
import authService from "./auth.service";
import { successResponse } from "../../common/response";
// import { ISignupResspones } from "./auth.entities";
import * as validators from "./auth.validation";  
// import { BadRequestExaption } from "../../common/exception";
import { validation } from "../middleware";
import { IUser } from "../../common/interfaces";

const router= Router();
router.post("/signup",validation(validators.signup),async (req: Request, res: Response)=>{
    let data = await authService.signup(req.body);
    successResponse<IUser>({res,status:201,data})
});

router.post("/login",validation(validators.login),async (req: Request, res: Response )=>{
    const result = authService.login(req.body)
    successResponse({res,data:result})
        // const validationResult =validators.login.body.safeParse(req.body);
        // console.log({validationResult});
        // if(!validationResult.success){
        //     throw new BadRequestExaption("validation error",{error: JSON.parse(validationResult.error as unknown as string)})
        // }
    // return res.status(200).json({message:"done login",data})
    // const data  = authService.login(req.body);
    // return successResponse<ILoginRessponse>({res,data })
})

// router.post("/signup",async(req: Request, res: Response ,next: NextFunction): Promise<Response> =>{
//         const validationResult =validators.signup.body.safeParse(req.body);
//         if(!validationResult.success){
//             throw new BadRequestExaption("validation error",{error: JSON.parse(validationResult.error as unknown as string)})
//         }
//     // try {
//     //     const data = await signupSchema.body.parseAsync(req.body);
//     // } catch (error) {
//     //     throw new BadRequestExaption("validation error",{error: JSON.parse(error as string)})
//     // }
//     const data  = authService.signup(req.body);
//     return successResponse<ISignupResspones>({res,status:201,data})
//     // return successResponse<ILoginRessponse>({res,data })
// })
export default router;
