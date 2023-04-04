import React from "react";
import FilmCard from "../components/FilmCard";
import axios from "axios";
import Cards from "../layouts/Cards";
import FilmCardPlaceholder from "../components/placeholder/FilmCardPlaceholder";

const ViewFilms = () => {

    const [films, setFilms] = React.useState<Array<Film>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        getFilms()
    }, [])

    const getFilms = () => {
        axios.get(process.env.REACT_APP_DOMAIN + "/films")
            .then((response) => {
                setErrorFlag(false)
                setFilms(response.data.films)
                setLoading(false)
            }, (error) => {
                setErrorFlag(true)
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


    if (loading) {
        return (
            <Cards>
                <FilmCardPlaceholder />
                <FilmCardPlaceholder />
                <FilmCardPlaceholder />
            </Cards>
        )
    }
    else {
        return (
            <div className="d-flex flex-column">
                {(films.length === 0) ? info_no_films() : ''}
                <Cards>
                    {list_of_films()}
                </Cards>
            </div>
        )
    }
}

export default ViewFilms;