import { default as feathers, Hook, HookContext } from '@feathersjs/feathers';
import validate from 'feathers-validate-joi';
import Joi from 'joi';
import { iff } from 'feathers-hooks-common';

const joiOutputDispatchOptions = {
  convert: true,
  abortEarly: false,
  getContext(context : HookContext) {
    return context.dispatch;
  },
  setContext(context : HookContext, newValues : any) {
    Object.assign(context.dispatch, newValues);
  },
};

export const dispatch = (schema : Joi.ObjectSchema<any>): Hook => {
  return (context : HookContext) => {
    console.log('Validating the output data');
    return iff(
      // Only run output validation if setting is set to true
      (context: HookContext) => context.app.get('validate_output'),
      validate.form(schema, joiOutputDispatchOptions)
    )(context);
  };
};
