import React from "react";
import FilmCard from "../components/FilmCard";
import axios from "axios";
import Cards from "../layouts/Cards";
import FilmCardPlaceholder from "../components/placeholder/FilmCardPlaceholder";

const ViewFilms = () => {

    const [films, setFilms] = React.useState<Array<Film>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [loading, setLoading] = React.useState(true)
    const [timedOut, setTimedOut] = React.useState(false)
    const [isOnline, setIsOnline] = React.useState(navigator.onLine)


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", handleStatusChange)
        window.addEventListener("offline", handleStatusChange)

        getFilms()

        return () => {
            clearTimeout(timer)
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        }
    }, [isOnline])

    const getFilms = () => {
        axios.get(process.env.REACT_APP_DOMAIN + "/films")
            .then((response) => {
                setErrorFlag(false)
                setFilms(response.data.films)
                setLoading(false)
            }, (error) => {
                console.log(error)

                if (error.code !== "ERR_NETWORK") {
                    setErrorFlag(true)
                    setErrorMessage(error.message)
                }
            })
    }

    const list_of_films = () => {
        console.log(films);
        return films.map((film: Film) =>
            <FilmCard key={film.filmId} film={film} />
        )
    }

    const info_no_films = () => {
        return (
            <div className="alert alert-info" role="alert">
                No films currently exist. Go <a href="/films/create" className="alert-link">here</a> to add a film you have directed.
            </div>
        )
    }

    const error_timed_out = () => {
        return (
            <div className="alert alert-danger" role="alert">
                We are having trouble connecting to the internet. Check your network settings or click <a href={window.location.href} className="alert-link">here</a> to try again.
            </div>
        )
    }

    const error_unexpected = () => {
        return (
            <div className="alert alert-danger" role="alert">
                An unexpected error has occurred: {errorMessage}
            </div>
        )
    }


    if (loading) {
        return (
            <div className="d-flex flex-column">
                {(errorFlag && !timedOut) ? error_unexpected() : ''}
                {(timedOut) ? error_timed_out() : ''}
                <div className="d-flex flex-column d-sm-none">
                    <Cards>
                        <FilmCardPlaceholder />
                    </Cards>
                </div>

                <div className="d-none flex-column d-sm-flex d-md-none">
                    <Cards>
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                    </Cards>
                </div>

                <div className="d-none flex-column d-md-flex">
                    <Cards>
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                        <FilmCardPlaceholder />
                    </Cards>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="d-flex flex-column">
                {(errorFlag) ? error_unexpected() : ''}
                {(films.length === 0) ? info_no_films() : ''}
                <Cards>
                    {list_of_films()}
                </Cards>
            </div>
        )
    }
}

export default ViewFilms;