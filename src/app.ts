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
import { RentalRequestControllers } from "./modules/rentalRequest/rentalRequest.controller";
import { RentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { reviewsRouter } from "./modules/review/review.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { PaymentControllers } from "./modules/payment/payment.controller";

const app : Application = express()

// middleware
app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    }),
);

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    PaymentControllers.stripeWebhook
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
app.use('/api/landlord', landlordRoutes)
app.use('/api/rentals', RentalRequestRoutes)
app.use('/api/reviews', reviewsRouter)
app.use('/api/payments', paymentRoutes)


app.use(notFound)
app.use(globalError)




export default app;