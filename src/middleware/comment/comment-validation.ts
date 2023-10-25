import { body } from "express-validator";
import {usersRepository} from "../../repositories/users-db-repository";

export const CommentValidation = ()=> {
    return [
        body('content')
            .notEmpty()
            .isString()
            .trim()
            .isLength({min:20, max:300})
            .withMessage('Invalid password'),

    ]
}