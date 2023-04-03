import React from "react";
import FilmCard from "../components/FilmCard";
import axios from "axios";
import Cards from "../layouts/Cards";

const ViewFilms = () => {

    const [films, setFilms] = React.useState<Array<Film>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)

    React.useEffect(() => {
        getFilms()
    }, [])

    const getFilms = () => {
        axios.get(process.env.REACT_APP_DOMAIN + "/films")
            .then((response) => {
                setErrorFlag(false)
                setFilms(response.data.films)
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

    if (errorFlag) {
        return (
            <h1>ERROR</h1>
        )
    }
    else {
        return (
            <Cards>
                {list_of_films()}
            </Cards>
        )
    }
}

export default ViewFilms;