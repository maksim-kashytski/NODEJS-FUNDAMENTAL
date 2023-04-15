import * as Joi from 'joi';

export const getUsersQuerySchema = Joi.object({
    loginSubstring: Joi.string().optional(),
    limit: Joi.number().optional()
});
