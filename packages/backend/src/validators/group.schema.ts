import * as Joi from 'joi';

export const addUsersToGroupBodySchema = Joi.object({
    userIds: Joi.array().items(Joi.number()).required()
});
