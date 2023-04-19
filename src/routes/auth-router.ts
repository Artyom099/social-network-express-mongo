import express, {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../utils";
import {AuthType, ReqBodyType} from "../types";


export const authRouter = Router({})

authRouter.post('/login', async (req: ReqBodyType<AuthType>, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult.resulcode === 0) {
        res.status(HTTP_STATUS.CREATED_201).send(checkResult.data)
    } else {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    }
})