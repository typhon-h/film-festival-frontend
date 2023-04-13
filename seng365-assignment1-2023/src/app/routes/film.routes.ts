import {Express} from "express";
import {rootUrl} from "./base.routes";
import * as film from '../controllers/film.controller';
import * as filmImages from '../controllers/film.image.controller';
import * as filmReviews from '../controllers/film.review.controller';
import {authenticate} from "../middleware/auth.middleware";

module.exports = (app: Express) => {
    app.route(rootUrl+'/films')
        .get(film.viewAll)
        .post(authenticate, film.addOne);

    app.route(rootUrl+'/films/genres')
        .get(film.getGenres);

    app.route(rootUrl+'/films/:id')
        .get(film.getOne)
        .patch(authenticate, film.editOne)
        .delete(authenticate, film.deleteOne);

    app.route(rootUrl+'/films/:id/reviews')
        .get(filmReviews.getReviews)
        .post(authenticate, filmReviews.addReview);

    app.route(rootUrl+'/films/:id/image')
        .get(filmImages.getImage)
        .put(authenticate, filmImages.setImage);
}