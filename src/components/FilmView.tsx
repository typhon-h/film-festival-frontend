import React from "react";
import FilmCard from "../components/FilmCard";
import axios from "axios";
import Cards from "../layouts/Cards";
import FilmCardPlaceholder from "../components/placeholder/FilmCardPlaceholder";
import { useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import Sort from "./Sort";
import Pagination from "./Pagination";
import Restricted from "../layouts/Restricted";

const FilmView = (props: any) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [films, setFilms] = React.useState<Array<Film>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [loading, setLoading] = React.useState(true)
    const [timedOut, setTimedOut] = React.useState(false)
    const [isSearch, setIsSearch] = React.useState(false)
    const [page, setPage] = React.useState<PageInfo>()
    const [numFilms, setNumFilms] = React.useState(0)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const buildQuery = () => {
            let query = "?"
            query += `startIndex=${(page) ? page.startIndex : 0}`
            query += `&count=${(page) ? page.count : 10}`

            setIsSearch((searchParams.get('q')) ? true : false)
            query += (isSearch) ? `&q=${searchParams.get('q')}` : ''

            const ratings = searchParams.getAll('ageRatings')
            if (ratings) {
                ratings.forEach(r => {
                    query += `&ageRatings=${r}`
                })
            }

            const genres = searchParams.getAll('genreIds')
            if (genres) {
                genres.forEach(g => {
                    query += `&genreIds=${g}`
                })
            }

            query += (searchParams.get('sortBy')) ? `&sortBy=${searchParams.get('sortBy')?.toUpperCase()}` : ''

            return query
        }

        const getFilms = () => {
            console.log(process.env.REACT_APP_DOMAIN + "/films" + buildQuery())
            axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery())
                .then((response) => {
                    setErrorFlag(false)
                    setFilms(response.data.films)
                    setNumFilms(response.data.count)
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
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
    }, [isSearch, searchParams, props.placeholder, page])

    const list_of_films = () => {
        return films.map((film: Film) =>
            <FilmCard key={film.filmId} film={film} />
        )
    }

    const info_no_films = () => {
        return (
            <div className="alert alert-info d-flex flex-row justify-content-center" role="alert">
                <div className='me-1'>No films match your request. Check your search and/or filters</div><Restricted> or go <a href="/films/create" className="alert-link">here</a> to add a film you have directed</Restricted>
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
            <div className="my-1">
                <h1 className="text-muted">Showing Results For:</h1>
                <h3 className={(films.length === 0) ? "text-danger" : "text-success"}>{searchParams.get('q')}</h3>
            </div>
        )
    }

    const default_title = () => {
        return (
            <div className="my-1">
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
                {(isSearch) ? search_title() : default_title()}
                {placeholder()}
            </div>
        )
    }

    return (
        <div className="d-flex flex-column">
            {(timedOut) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}

            {(isSearch) ? search_title() : default_title()}

            <div className={'d-flex flex-column-reverse flex-md-row align-items-end align-items-md-start justify-content-between mx-5 mb-2'}>
                <Sort updateParams={setSearchParams} />
                <Filters updateParams={setSearchParams} />
            </div>

            {(films.length === 0) ? info_no_films() : ''}
            <Cards>
                {list_of_films()}
            </Cards>

            <Pagination numFilms={numFilms} updatePage={setPage} />
        </div>
    )

}
export default FilmView;