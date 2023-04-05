import React from "react";
import FilmCard from "../components/FilmCard";
import axios from "axios";
import Cards from "../layouts/Cards";
import FilmCardPlaceholder from "../components/placeholder/FilmCardPlaceholder";
import { useSearchParams } from "react-router-dom";

const FilmView = (props: any) => {

    const [searchParams] = useSearchParams();
    const [films, setFilms] = React.useState<Array<Film>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [loading, setLoading] = React.useState(true)
    const [timedOut, setTimedOut] = React.useState(false)
    const [isSearch, setIsSearch] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const buildQuery = () => {
            let query = ""

            setIsSearch((searchParams.get('q')) ? true : false)
            query += (isSearch) ? `&q=${searchParams.get('q')}` : ''

            return query
        }

        const getFilms = () => {
            axios.get(process.env.REACT_APP_DOMAIN + "/films?unused=" + buildQuery())
                .then((response) => {
                    setErrorFlag(false)
                    setFilms(response.data.films)
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
                }, (error) => {
                    console.log(error)

                    if (error.code !== "ERR_NETWORK") {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    }

                    clearTimeout(timer)
                    setTimedOut(false)

                })
        }

        getFilms()
    }, [props.placeholder, isSearch, searchParams])

    const list_of_films = () => {
        return films.map((film: Film) =>
            <FilmCard key={film.filmId} film={film} />
        )
    }

    const info_no_films = () => {
        return (
            <div className="alert alert-info" role="alert">
                No films match your request. Check your criteria or go <a href="/films/create" className="alert-link">here</a> to add a film you have directed.
            </div>
        )
    }

    const error_timed_out = () => {
        return (
            <div className="alert alert-warning" role="alert">
                Slow network connection. Please check your network or wait while we process your request
            </div>
        )
    }

    const error_unexpected = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {errorMessage}
            </div>
        )
    }

    const search_title = () => {
        return (
            <div className="my-2">
                <h1 className="text-muted">Showing Results For:</h1>
                <h3 className={(films.length === 0) ? "text-danger" : "text-success"}>{searchParams.get('q')}</h3>
            </div>
        )
    }

    const default_title = () => {
        return (
            <div className="my-2">
                <h1 className="text-muted">All Films</h1>
            </div>
        )
    }

    const placeholder = () => {
        return (
            <div className="d-flex flex-column">
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

    if (props.placeholder || loading) {
        return (
            <div className="d-flex flex-column">
                {(timedOut) ? error_timed_out() : ''}
                {(errorFlag) ? error_unexpected() : ''}
                {default_title()}
                {placeholder()}
            </div>
        )
    }

    return (
        <div className="d-flex flex-column">
            {(films.length === 0) ? info_no_films() : ''}
            {(timedOut) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}

            {(isSearch) ? search_title() : default_title()}

            <Cards>
                {list_of_films()}
            </Cards>
        </div>
    )

}

export default FilmView;