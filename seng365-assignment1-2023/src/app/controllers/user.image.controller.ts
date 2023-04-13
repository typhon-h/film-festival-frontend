import {Request, Response} from "express";
import * as Users from "../models/user.model";
import {addImage, readImage, removeImage} from "../models/images.model";
import Logger from "../../config/logger";
import {getImageExtension} from "../models/imageTools";

const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const filename = await Users.getImageFilename(userId)
        if(filename == null) {
            res.status(404).send();
            return;
        }
        const [image, mimetype]  = await readImage(filename)
        res.status(200).contentType(mimetype).send(image)
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

const setImage = async (req: Request, res: Response): Promise<void> => {
    try{
        let isNew = true;
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const image = req.body;
        const user = await Users.findUserById(userId);
        if(req.authId !== userId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
            return;
        }
        if(user == null) {
            res.status(404).send();
            return;
        }
        const mimeType = req.header('Content-Type');
        const fileExt = getImageExtension(mimeType);
        if (fileExt === null) {
            res.statusMessage = 'Bad Request: photo must be image/jpeg, image/png, image/gif type, but it was: ' + mimeType;
            res.status(400).send();
            return;
        }

        if (image.length === undefined) {
            res.statusMessage = 'Bad request: empty image';
            res.status(400).send();
            return;
        }

        const filename = await Users.getImageFilename(userId);
        if(filename != null && filename !== "") {
            await removeImage(filename);
            isNew = false;
        }
        const newFilename = await addImage(image, fileExt);
        await Users.setImageFileName(userId, newFilename);
        if(isNew)
            res.status(201).send()
        else
            res.status(200).send()
    } catch (err) {
        Logger.error(err)
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const user = await Users.findUserById(userId);
        if (req.authId !== userId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
            return;
        }
        if (user == null) {
            res.status(404).send();
            return;
        }
        const filename = await Users.getImageFilename(userId);
        if (filename == null || filename === "") {
            res.status(404).send();
            return;
        }
        await removeImage(filename);
        await Users.removeImageFilename(userId)
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.status(500).send();
    }
}

export {getImage, setImage, deleteImage}