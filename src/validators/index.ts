import Joi from "joi";

export const validator = {
    query: Joi.object({
        conversationId: Joi.string(),
        query: Joi.string().alphanum(),
    })
}