import axios from "axios"
import React from "react"
import FilmCard from "./FilmCard"

const SimilarFilms = (props: any) => {
    const [directorFilms, setDirectorFilms] = React.useState<Film[]>([])
    const [genreFilms, setGenreFilms] = React.useState<Film[]>([])

    React.useEffect(() => {
        const getFilms = () => {
            console.log(process.env.REACT_APP_DOMAIN + "/films?directorId=" + props.directorId)
            axios.get(process.env.REACT_APP_DOMAIN + "/films?directorId=" + props.directorId)
                .then((response) => {
                    setDirectorFilms(response.data.films)
                    console.log(response.data.films)
                }, (error) => {
                    console.log(error)
                })
        }

        getFilms()

    }, [props.directorId])

    React.useEffect(() => {
        const getFilms = () => {
            console.log(process.env.REACT_APP_DOMAIN + "/films?genreIds=" + props.genreId)
            axios.get(process.env.REACT_APP_DOMAIN + "/films?genreIds=" + props.genreId)
                .then((response) => {
                    setGenreFilms(response.data.films)
                }, (error) => {
                    console.log(error)
                })
        }

        getFilms()

    }, [props.genreId])


    const getFilms = (): Film[] => {
        const result = (directorFilms.length > genreFilms.length) ? mergeArrays(genreFilms, directorFilms) : mergeArrays(directorFilms, genreFilms)

        return result.filter(film => film.filmId !== props.filmId)
    }

    const mergeArrays = (arr1: Film[], arr2: Film[]): Film[] => {
        arr1.forEach((film) => {
            if (!arr2.find((entry) => { return entry.filmId === film.filmId })) {
                arr2.push(film)
            }
        });

        return arr2;
    }

    return (
        <div id="similarFilms" className="carousel carousel-dark slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {getFilms().map((film: Film, index) =>
                    <button key={index} type="button" data-bs-target="#similarFilms" data-bs-slide-to={index} className={' ' + ((index === 0) ? 'active' : '')} aria-current={((index === 0) ? true : false)} aria-label={`Slide ${index}`}></button>
                )}
            </div>
            <div className="carousel-inner">

                {getFilms().map((film: Film, index) =>
                    <div key={index} className={"carousel-item " + ((index === 0) ? 'active' : '')}>
                        <FilmCard film={film} />
                    </div>
                )}

            </div >
            <button className="carousel-control-prev" type="button" data-bs-target="#similarFilms" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-dark" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#similarFilms" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-dark" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div >
    )
}

export default SimilarFilms