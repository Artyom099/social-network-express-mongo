import {TUser} from "../types";

declare global {
    declare namespace Express {
        export interface Request {
            userId: string | null
            user: TUser | null
        }
    }
}
