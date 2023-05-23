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
import { AuthContext } from "../util/Contexts";

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
    const [activeUser] = React.useContext(AuthContext)
    const [filmState, setFilmState] = React.useState<string>('allFilms')

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const buildQuery = () => {
            let query = "?"

            if (filmState !== 'myFilmsAll') {
                query += `&startIndex=${(page) ? page.startIndex : 0}`
                query += `&count=${(page) ? page.count : 10}`
            }

            setIsSearch((searchParams.get('q')) ? true : false)
            query += (searchParams.get('q')) ? `&q=${searchParams.get('q')}` : ''

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
            const requests = []
            switch (filmState) {
                case 'myFilmsDirected':
                    requests.push(axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery() + `&directorId=${parseInt(activeUser, 10)}`))
                    break;
                case 'myFilmsReviewed':
                    requests.push(axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery() + `&reviewerId=${parseInt(activeUser, 10)}`))
                    break
                case 'myFilmsAll':
                    requests.push(axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery() + `&directorId=${parseInt(activeUser, 10)}`))
                    requests.push(axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery() + `&reviewerId=${parseInt(activeUser, 10)}`))
                    break
                default:
                    requests.push(axios.get(process.env.REACT_APP_DOMAIN + "/films" + buildQuery()))
                    break
            }
            axios.all(requests)
                .then((responses) => {
                    let result: Film[] = []
                    let count: number = 0;
                    responses.forEach((response) => {
                        result = result.concat(response.data.films).filter(
                            (item: Film, index: number, arr: Film[]) => {
                                if (arr.findIndex(film => film.filmId === item.filmId) === index) {
                                    return true
                                }
                                else {
                                    count--;
                                    return false
                                }
                            })
                        count += response.data.count
                    })
                    // if multiple requests are concatenated must do another sort at frontend
                    if (requests.length > 1) {
                        switch (searchParams.get('sortBy')) {
                            case 'ALPHABETICAL_ASC':
                                result.sort((a, b) => a.title.localeCompare(b.title))
                                break
                            case 'ALPHABETICAL_DESC':
                                result.sort((b, a) => a.title.localeCompare(b.title))
                                break
                            case 'RATING_ASC':
                                result.sort((a, b) => a.rating.toString().localeCompare(b.rating.toString()))
                                break
                            case 'RATING_DESC':
                                result.sort((b, a) => a.rating.toString().localeCompare(b.rating.toString()))
                                break
                            case 'RELEASED_ASC':
                                result.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
                                break
                            case 'RELEASED_DESC':
                                result.sort((b, a) => a.releaseDate.localeCompare(b.releaseDate))
                                break
                        }

                        if (page) {
                            result = result.slice(page?.startIndex, page?.startIndex + page?.count)
                        } else {
                            result = result.slice(0, 10)
                        }
                    }
                    setErrorFlag(false)
                    setFilms(result)
                    setNumFilms(count)
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
    }, [isSearch, searchParams, props.placeholder, page, filmState, activeUser])

    const list_of_films = () => {
        return films.map((film: Film) =>
            <FilmCard key={film.filmId} film={film} />
        )
    }

    const info_no_films = () => {
        return (
            <div className="alert alert-info d-flex flex-column justify-content-center" role="alert">
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
                <h1 className="text-muted">
                    All Films
                </h1>
            </div>
        )
    }

    const user_films_menu = () => {
        let prefix;
        switch (filmState) {
            case 'myFilmsDirected':
                prefix = 'Directed'
                break
            case 'myFilmsReviewed':
                prefix = 'Reviewed'
                break
            case 'allFilms':
            case 'myFilmsAll':
            default:
                prefix = 'My'
                break
        }

        return (
            <ul className="nav nav-tabs nav-fill mb-3">
                <li className="nav-item">
                    <button className={"nav-link " + ((filmState === 'allFilms') ? 'active' : '')} onClick={() => {
                        document.getElementById('myFilmsDropdownMenu')?.classList.remove('show');
                        document.getElementById('myFilmsDropdownButton')?.setAttribute('aria-expanded', 'false');
                        setFilmState('allFilms');
                    }} aria-current="page">All Films</button>
                </li>
                <li className="nav-item dropdown">
                    <button className={"nav-link dropdown-toggle " + ((filmState.includes('myFilms')) ? 'active' : '')} id="myFilmsDropdownButton" type='button' data-bs-toggle="dropdown" data-bs-auto-close="true">{prefix} Films</button>
                    <ul className="dropdown-menu w-100 text-center" aria-labelledby="myFilmsDropdownButton" id="myFilmsDropdownMenu">
                        <li><button className="dropdown-item" onClick={() => {
                            document.getElementById('myFilmsDropdownMenu')?.classList.remove('show');
                            document.getElementById('myFilmsDropdownButton')?.setAttribute('aria-expanded', 'false');
                            setFilmState('myFilmsAll');
                        }}>All</button></li>
                        <li><button className="dropdown-item" onClick={() => {
                            document.getElementById('myFilmsDropdownMenu')?.classList.remove('show');
                            document.getElementById('myFilmsDropdownButton')?.setAttribute('aria-expanded', 'false');
                            setFilmState('myFilmsDirected');
                        }}>Directed</button></li>
                        <li><button className="dropdown-item" onClick={() => {
                            document.getElementById('myFilmsDropdownMenu')?.classList.remove('show');
                            document.getElementById('myFilmsDropdownButton')?.setAttribute('aria-expanded', 'false');
                            setFilmState('myFilmsReviewed');
                        }}>Reviewed</button></li>
                    </ul>
                </li>
            </ul>
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

            <Restricted>
                {user_films_menu()}
            </Restricted>

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