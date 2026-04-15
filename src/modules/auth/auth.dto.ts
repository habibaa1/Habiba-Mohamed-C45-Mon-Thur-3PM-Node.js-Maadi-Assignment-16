import {z} from "zod";

import { login , signup } from "./auth.validation";

export type LoginDto = z.infer<typeof login.body>
export type SignupDto = z.infer<typeof signup.body>

// export interface LoginDto{
//     email:string,
//     password:string
// }

// export interface SignupDto extends LoginDto{
//     username:string;
// }

//tnbehat lya ka developer 3shan a3rf el data type elly haye5odha el function w elly hayerga3ha