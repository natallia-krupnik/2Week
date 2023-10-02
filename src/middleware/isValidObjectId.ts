import {NextFunction} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../types/statutes";
import {Request, Response,} from "express"

export const isValidObjectId = (req: Request<{ id: string }, {}, {}, {}>, res: Response, next: NextFunction) => {
    const id = req.params.id;

    console.log(id, 'id')

    const isValid = ObjectId.isValid(id);

    if (!isValid) {
        res.status(HTTP_STATUSES.not_found_404).send()
        return
    }

    return next()
}
