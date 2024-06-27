import Joi from 'joi';
import { GLOBAL_CACHE_KEY, MODEL_KEY } from './constants'
import { ChatOpenAI } from "@langchain/openai";

export const fileCache = () => {
    const cache: any = {}
    return {
        get: (key: string) => cache[key],
        set: (key: string, value: any) => cache[key] = value,
        cache,
    }
}

export const attachCache = (cache: any) => {
    return (req: any, res: Express.Response, next: any) => {
        req[GLOBAL_CACHE_KEY] = cache
        next()
    }
}

export const attachModel = () => {
    return (req: any, res: Express.Response, next:any) => {
        req[MODEL_KEY] = new ChatOpenAI();
        next()
    }
}

export const bodyValidator = (validator: Joi.ObjectSchema) => {
    return (req: any, res: Express.Response, next: any) => {
        const { error } = validator.validate(req.body);
        if (error) {
            next(error);
        } else {
            next()
        }
    }
}