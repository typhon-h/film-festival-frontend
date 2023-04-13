import {Request, Response} from "express";
import Logger from '../../config/logger';
import * as User from '../models/user.model';
import * as passwords from '../services/passwords';
import * as schemas from '../resources/schemas.json';
import {validate} from '../services/validator'
import {uid} from 'rand-token';

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(
            schemas.user_register,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }
        req.body.password = await passwords.hash(req.body.password)
        const result = await User.register(req.body);
        res.status( 201 ).send({"userId": result.insertId});
        return;
    } catch (err) {
        Logger.error(err)
        if (err.errno === 1062) { // 1062 = Duplicate entry MySQL error number
            res.statusMessage = "Forbidden: Email already in use";
            res.status(403).send();
            return;
        } else {
            res.statusMessage = "Internal Server Error";
            res.status(500).send();
            return;
        }
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(
            schemas.user_login,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }
        const user = await User.findUserByEmail(req.body.email);
        if(user === null || !await passwords.compare(req.body.password, user.password)) {
            res.statusMessage = 'Invalid email/password';
            res.status(401).send();
            return;
        }
        const token = uid(64)
        await User.login(user.id, token)
        res.status( 200 ).send({"userId": user.id, "token": token});
        return;
    } catch (err) {
        Logger.error(err)
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.authId;
        await User.logout(userId)
        res.status(200).send()
        return;
    } catch (err) {
        Logger.error(err)
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const view = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const user = await User.view(id)
        if(user === null) {
            res.statusMessage = "User not found"
            res.status(404).send();
            return;
        }
        if(req.authId === id) {
            res.status(200).send(user)
            return;
        }
        delete user.email
        res.status(200).send(user as userReturn)
        return;
    } catch (err) {
        Logger.error(err)
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const user = await User.findUserById(id)
        if(user === null){
            res.status(404).send();
            return;
        }
        if(req.authId !== parseInt(req.params.id, 10)){
            res.status(403).send();
            return;
        }

        const validation = await validate(
            schemas.user_edit,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        if(req.body.hasOwnProperty("password")) {
            if(req.body.hasOwnProperty("currentPassword")) {
                if(!await passwords.compare(req.body.currentPassword, user.password)) {
                    res.statusMessage = "Incorrect currentPassword";
                    res.status(401).send();
                    return;
                } else {
                    if(await passwords.compare(req.body.password, user.password)){
                        res.statusMessage = "New password can not be the same as old password";
                        res.status(403).send();
                        return;
                    }
                    user.password = await passwords.hash(req.body.password);
                }
            } else {
                res.statusMessage = "currentPassword must be supplied to change password";
                res.status(400).send();
                return;
            }
        }
        await User.update(user);
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err)
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export {register, login, logout, view, update}