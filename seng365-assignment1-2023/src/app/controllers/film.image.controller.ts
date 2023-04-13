import {Request, Response} from "express";
import Logger from "../../config/logger";
import * as Films from "../models/film.model";
import {addImage, readImage, removeImage} from "../models/images.model";
import {getImageExtension} from "../models/imageTools";

const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const filmId = parseInt(req.params.id, 10);
        if (isNaN(filmId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const filename = await Films.getImageFilename(filmId)
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
        const filmId = parseInt(req.params.id, 10);
        if (isNaN(filmId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const image = req.body;
        const film = await Films.getOne(filmId);
        if (film == null){
            res.statusMessage = "No such film"
            res.status(404).send();
        }
        if(req.authId !== film.directorId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
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

        const filename = await Films.getImageFilename(filmId);
        if(filename != null && filename !== "") {
            await removeImage(filename);
            isNew = false;
        }
        const newFilename = await addImage(image, fileExt);
        await Films.setImageFilename(filmId, newFilename);
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


export {getImage, setImage};