import React from "react";
import FilmView from "../components/FilmView";
import { OnlineContext } from "../util/Contexts";

const ViewFilms = () => {

    const [isOnline] = React.useContext(OnlineContext)

    const error_offline = () => {
        return (
            <div className="alert alert-danger" role="alert">
                We are having trouble connecting to the internet. Check your network settings or click <a href={window.location.href} className="alert-link">here</a> to try again.
            </div>
        )
    }

    return (
        <div className="d-flex flex-column">
            {(!isOnline) ? error_offline() : ''}
            <FilmView placeholder={!isOnline} />
        </div>
    )
}

export default ViewFilms;