import { body } from "express-validator";
import { usersRepository } from "../../repositories/users-db-repository";

export const EmailValidation = ()=> {
    return [

        body('email')
            .notEmpty()
            .isString()
            .trim()
            .isEmail()
            .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
            .custom( async(value) => {
                const emailIsExist = await usersRepository.findExistedEmail(value)

                if(!emailIsExist){
                    throw new Error('Email not exist')
                }
                return true
            })
            .withMessage('Invalid email'),
    ]
}
