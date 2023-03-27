import * as Joi from 'joi';

export const authBodySchema = Joi.object({
    login: Joi.required(),
    password: Joi.required()
});

