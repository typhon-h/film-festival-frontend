import axios from "axios";
import React from "react";
import { Buffer } from "buffer";

const FilmCard = (film: FilmCard) => {

    const [genre, setGenre] = React.useState<Genre>({ genreId: 0, name: "Unknown" });
    const [heroImage, setHeroImage] = React.useState<Image>({ data: "", type: "" });
    const [directorImage, setDirectorImage] = React.useState<Image>({ data: "", type: "" });


    React.useEffect(() => {
        getGenre()
        getHeroImage()
        getDirectorImage()
    })

    const getGenre = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
            .then((response) => {
                setGenre(response.data.filter((g: Genre) => g.genreId === film.genreId)[0]);
            }, (error) => {
                // Genre has default value from useState
            })
    }

    const getHeroImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + film.filmId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setHeroImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }

    const getDirectorImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + film.directorId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setDirectorImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }



    return (
        <a href={'/films/' + film.filmId} className="card d-flex w-50 flex-column flex-md-row overflow-hidden text-decoration-none text-dark m-1">
            <div className="col-md-6 img-thumbnail overflow-hidden d-flex align-items-center justify-content-center">
                <img className="h-100" style={{ minWidth: '100%' }} src={`data:${heroImage.type};base64,${heroImage.data}`} alt="Hero" />
            </div>

            <div className="card-body d-flex flex-column justify-content-around">
                <h5 className="card-title display">{film.title}</h5>

                <div className="d-flex flex-row justify-content-around">
                    <div className="d-flex flex-column">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Classification</p>
                            <p className="card-text">{film.ageRating}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Avg. Rating</p>
                            <p className="card-text">{film.rating}</p>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Genre</p>
                            <p className="card-text">{genre.name}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Release Date</p>
                            <p className="card-text">{film.releaseDate}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-center justify-content-around">
                    <div className="ratio ratio-1x1 rounded-circle border overflow-hidden" style={{ minWidth: '20%', maxWidth: '20%' }}>
                        <img className="object-fit-cover mx-auto" src={`data:${directorImage.type};base64,${directorImage.data}`} alt="Director Icon" />
                    </div>
                    <p className="mb-0">{film.directorFirstName}</p>
                    <p className="mb-0">{film.directorLastName}</p>
                </div>

            </div>

        </a >
    )
}

export default FilmCard