import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { catchAsync } from "../modules/utils/catchAsync";

const validateRequest = (schema: AnySchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // body, query, params - jekhane validate korte chao shei structure e schema likhte hobe
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false, // shob error ekshathe dekhabe, first error e stop korbe na
        stripUnknown: true, // extra field gula silently remove korbe
      }
    );

    next();
  });
};

export default validateRequest;