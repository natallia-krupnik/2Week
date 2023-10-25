import {Request} from "express";


declare global {
    namespace Express {
        interface Request {
            user: any; // Здесь укажите тип вашего пользователя
        }
    }
}