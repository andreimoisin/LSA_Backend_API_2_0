//DATA VALIDATION
const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        account_type: Joi.string().valid("STUDENT", "TEACHER", "ADMIN", "ROOT").required(),
        birth: Joi.number().min(1940).max(2020).required(),
        gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const resetPassValidation = data => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        repassword: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.resetPassValidation = resetPassValidation;