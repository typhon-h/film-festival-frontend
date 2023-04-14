import axios from "axios"
import React from "react"
import FilmCard from "./FilmCard"

const SimilarFilms = (props: any) => {
    const [result, setResult] = React.useState<Film[]>([])


    React.useEffect(() => {
        const getFilms = () => {
            axios.all([axios.get(process.env.REACT_APP_DOMAIN + "/films?directorId=" + props.directorId),
            axios.get(process.env.REACT_APP_DOMAIN + "/films?genreIds=" + props.genreId)
            ]).then((responses) => {
                setResult(
                    responses[1].data.films.concat(responses[0].data.films).filter((item: Film, index: number, arr: Film[]) =>
                        item.filmId !== props.filmId && arr.findIndex(film => film.filmId === item.filmId) === index)
                )
            })
        }

        getFilms()

    }, [props.directorId, props.filmId, props.genreId])



    if (result.length === 0) {
        return (
            <div></div>
        )
    }


    return (
        <div className='d-flex flex-column align-items-center col-12'>
            <h3>You may also enjoy</h3>

            <div id="similarFilms" className="carousel carousel-dark slide col-12" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {result.map((film: Film, index) =>
                        <button key={index} type="button" data-bs-target="#similarFilms" data-bs-slide-to={index} className={' ' + ((index === 0) ? 'active' : '')} aria-current={((index === 0) ? true : false)} aria-label={`Slide ${index}`}></button>
                    )}
                </div>
                <div className="carousel-inner">
                    {result.map((film: Film, index) =>
                        <div key={index} className={"carousel-item " + ((index === 0) ? 'active' : '')}>
                            <FilmCard film={film} />
                        </div>
                    )}
                </div >
                <button className="carousel-control-prev" type="button" data-bs-target="#similarFilms" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#similarFilms" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div >
        </div>
    )
}

export default React.memo(SimilarFilms)