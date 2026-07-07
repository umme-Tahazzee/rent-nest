import express,{ Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";

import { authRoutes } from "./modules/auth/auth.routes";
import { notFound } from "./middleware/not-found";
import { globalError } from "./middleware/globalError";
import { userRoutes } from "./modules/user/user.route";
import { propertyRoutes } from "./modules/property/property.route";
import { categoryRoutes } from "./modules/category/category.route";

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
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/properties', propertyRoutes)



app.use(notFound)
app.use(globalError)




export default app;