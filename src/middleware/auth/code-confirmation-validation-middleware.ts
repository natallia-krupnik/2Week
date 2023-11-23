import { body } from "express-validator";
import {usersRepository} from "../../repositories/users-db-repository";

export const CodeConfirmationValidation = ()=> {
    return [
        body('code')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:1})
            .withMessage('Invalid code'),
    ]
}

