import type { Express,Request,Response,NextFunction} from "express";
import express from "express";
import { authRouter } from "./modules";
import { globalErroHandler } from "./modules/middleware";
import { connectDB } from "./DB/connections.db";
import { PORT } from "./config/config";
export const bootstrap = async () => {
    const app:Express = express();
    app.use(express.json());

    //     app.get("/" , (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    //     res.status(200).json({message:"landing page"});
    // })  mmkn ashel al type mn hna al hea kalmt express 3shan hdkhlha fo2
    app.get("/" , (req:Request,res:Response,next:NextFunction)=>{
        res.status(200).json({message:"landing page"});
    })
    //application routes
    app.use("/auth", authRouter);

    //application error
    app.use(globalErroHandler)
    app.get("/*dummy" , (req:Request,res:Response,next:NextFunction)=>{
        res.status(404).json({message:"invalid route"});
    })
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}👌`);
    });
    await connectDB();
    // console.log("application is bootstrapped");
}