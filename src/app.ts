import express,{ Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { userRouters } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { notFound } from "./middleware/not-found";
import { globalError } from "./middleware/globalError";

const app : Application = express()

// middleware
app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    }),
);
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.get("/", (req:Request,res:Response)=>{
      res.send("hello world")
})


//all routes
app.use('/api/users', userRouters)
app.use('/api/auth', authRoutes)


app.use(notFound)
app.use(globalError)


export default app;