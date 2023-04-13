import {Request, Response} from "express";
import * as Film from "../models/film.model";
import * as Review from "../models/film.review.model";
import Logger from "../../config/logger";
import {validate} from '../services/validator'
import * as schemas from "../resources/schemas.json";


const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const filmId = parseInt(req.params.id, 10);
        if (isNaN(filmId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const film = await Film.getOne(filmId);
        if (film == null) {
            res.status(404).send();
            return
        }
        const reviews = await Review.getReviews(filmId);
        res.status(200).send(reviews);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const addReview = async (req:Request, res: Response): Promise<void> => {
    try{
        const filmId = parseInt(req.params.id, 10);
        if (isNaN(filmId)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }
        const film = await Film.getOne(filmId);
        if (film == null) {
            res.status(404).send();
            return;
        }
        if (film.directorId === req.authId) {
            res.statusMessage = "Cannot post a review on your own film.";
            res.status(403).send();
            return;
        }

        if (Date.parse(film.releaseDate) > Date.now()){
            res.statusMessage = "Cannot place a review on a film that has not yet released.";
            res.status(403).send();
            return;
        }

        const reviews = await Review.getReviews(filmId);
        if ( reviews.find((r) => r.reviewerId === req.authId) !== undefined){
            res.statusMessage = "Cannot post more than one review on a film.";
            res.status(403).send();
            return;
        }

        const validation = await validate(schemas.film_review_post, req.body);
        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const added = await Review.addReview(filmId, req.authId, req.body.review, parseInt(req.body.rating, 10));
        res.status(201).send();

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

export {getReviews, addReview}