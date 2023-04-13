import {Express} from "express";
import {rootUrl} from "./base.routes";
import {authenticate, relaxedAuthenticate} from "../middleware/auth.middleware";
import * as user from '../controllers/user.controller';
import * as userImages from '../controllers/user.image.controller';

module.exports = (app: Express) => {
    app.route(rootUrl+'/users/register')
        .post(user.register);

    app.route(rootUrl+'/users/login')
        .post(user.login);

    app.route(rootUrl+'/users/logout')
        .post(authenticate, user.logout);

    app.route(rootUrl+'/users/:id')
        .get(relaxedAuthenticate, user.view)
        .patch(authenticate, user.update);

    app.route(rootUrl+'/users/:id/image')
        .get(userImages.getImage)
        .put(authenticate, userImages.setImage)
        .delete(authenticate, userImages.deleteImage)
}