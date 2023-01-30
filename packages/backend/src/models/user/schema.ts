import * as Joi from 'joi';

/**
 * This schema contains rules that would be applied to params while creating user.
 */
export const createUserSchema = Joi.object({
    login: Joi.string().alphanum().required(),
    password: Joi.string().alphanum().regex(/\S*(\S*([a-zA-Z]\S*[0-9])|([0-9]\S*[a-zA-Z]))\S*/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean()
}) as Joi.Schema;

/**
 * This schema contains rules that would be applied to params while updating user.
 */
export const updateUserSchema = Joi.object({
    id: Joi.number().optional(),
    login: Joi.string().alphanum().optional(),
    password: Joi.string().alphanum().regex(/\S*(\S*([a-zA-Z]\S*[0-9])|([0-9]\S*[a-zA-Z]))\S*/).optional(),
    age: Joi.number().min(4).max(130).optional(),
    isDeleted: Joi.boolean().optional()
}) as Joi.Schema;

/**
 * This schema contains rules that would be applied to params while getting user by login.
 */
export const getUsersQuerySchema = Joi.object({
    loginSubstring: Joi.string().optional(),
    limit: Joi.number().optional()
}) as Joi.Schema;
