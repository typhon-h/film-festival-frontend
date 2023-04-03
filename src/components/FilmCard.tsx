import axios from "axios";
import React from "react";
import { Buffer } from "buffer";

const FilmCard = (props: any) => {

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
                setGenre(response.data.filter((g: Genre) => g.genreId === props.film.genreId)[0]);
            }, (error) => {
                // Genre has default value from useState
            })
    }

    const getHeroImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + props.film.filmId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setHeroImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }

    const getDirectorImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + props.film.directorId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setDirectorImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }



    return (
        <a href={'/films/' + props.film.filmId} className="card d-flex flex-column flex-lg-row align-items-center overflow-hidden text-decoration-none text-dark mb-3" style={{ maxWidth: '24rem' }}>
            <div className="w-75 img-thumbnail overflow-hidden d-flex align-items-center m-2">
                <img className="h-100 object-fit-cover" style={{ minWidth: '100%' }} src={`data:${heroImage.type};base64,${heroImage.data}`} alt="Hero" />
            </div>

            <div className="card-body col-lg d-flex flex-column justify-content-around">
                <h5 className="card-title display">{props.film.title}</h5>

                <div className="d-flex flex-column flex-md-row justify-content-around p-2">
                    <div className="d-flex flex-column mb-3">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Classification</p>
                            <p className="card-text">{props.film.ageRating}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Avg. Rating</p>
                            <p className="card-text">{props.film.rating ? props.film.rating : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Genre</p>
                            <p className="card-text">{genre.name}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Release Date</p>
                            <p className="card-text">{new Date(props.film.releaseDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-center justify-content-around">
                    <div className="ratio ratio-1x1 rounded-circle border overflow-hidden" style={{ minWidth: '20%', maxWidth: '20%' }}>
                        <img className="object-fit-cover mx-auto" src={`data:${directorImage.type};base64,${directorImage.data}`} alt="Director Icon" />
                    </div>
                    <p className="mb-0">{props.film.directorFirstName}</p>
                    <p className="mb-0">{props.film.directorLastName}</p>
                </div>

            </div>

        </a >
    )
}

export default FilmCard