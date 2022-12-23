import Joi from 'joi';
import { NanoIdSchema } from './partials/nano_id';

// Management Schema's

const UserBaseSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(3),
    permissions: Joi.array().min(1).required()
})

const UserDetailsSchema = UserBaseSchema.keys({
    id: NanoIdSchema.required()
})

const UserCreateSchema = UserBaseSchema.keys({
    password: Joi.string().min(12).required(),
})


export const UserSchemas = {
    _base: UserBaseSchema,
    _create: UserCreateSchema,
    _details: UserDetailsSchema
}