import { Response } from "express";

type Tmeta = {
         page:number;
         limit : number;
         total : number
      }

type TResponseData<T> = {
      success : boolean;
      statusCode : number;
      message: string;
      data: T;
      meta?: Tmeta
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) =>{
        res.status(data.statusCode).json({
            success : data.statusCode,
            statusCode : data.statusCode,
            message : data.message,
            data: data.data,
            meta: data.meta
        })

}