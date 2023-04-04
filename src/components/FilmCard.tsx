import axios from "axios";
import React from "react";
import { Buffer } from "buffer";

const FilmCard = (props: any) => {

    const [genre, setGenre] = React.useState<Genre>({ genreId: 0, name: "Unknown" });
    const [heroImage, setHeroImage] = React.useState<Image>({ data: "", type: "" });
    const [directorImage, setDirectorImage] = React.useState<Image>({ data: "", type: "" });
    const [genreLoaded, setGenreLoaded] = React.useState<boolean>(false);
    const [heroImageLoaded, setHeroImageLoaded] = React.useState<boolean>(false);
    const [directorImageLoaded, setDirectorImageLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        getGenre()
        getHeroImage()
        getDirectorImage()
    })

    const getGenre = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
            .then((response) => {
                setGenre(response.data.filter((g: Genre) => g.genreId === props.film.genreId)[0]);
                setGenreLoaded(true)
            }, (error) => {
                // Genre has default value from useState
            })
    }

    const getHeroImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + props.film.filmId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setHeroImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
                setHeroImageLoaded(true)
            }, (error) => {
                // Image not found
            })
    }

    const getDirectorImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + props.film.directorId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setDirectorImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
                setDirectorImageLoaded(true)
            }, (error) => {
                // Image not found
            })
    }

    return (
        <a href={'/films/' + props.film.filmId} className={'card d-flex flex-column flex-lg-row justify-content-center align-items-lg-center text-decoration-none text-dark mb-3 col-12 col-sm-5 col-md-4 col-lg-6 col-xl-4 ' + (heroImageLoaded ? '' : 'placeholder-glow')}>
            <div className={'h-50 col-lg-4 col-xl-4 img-thumbnail ' + (heroImageLoaded ? '' : 'placeholder')} >
                <img className={'w-100 h-100 ' + (heroImageLoaded ? '' : 'invisible')} src={`data:${heroImage.type};base64,${heroImage.data}`} alt="Hero" style={{ boxSizing: 'border-box' }} />
            </div>

            <div className="card-body d-flex flex-column justify-content-around col-lg-7 col-xl-3">
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
                            <p className={'card-text ' + (genreLoaded ? '' : 'placeholder-glow placeholder')}>{genre.name}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Release Date</p>
                            <p className="card-text">{new Date(props.film.releaseDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className={'d-flex flex-row align-items-center justify-content-around ' + (directorImageLoaded ? '' : 'placeholder-glow')}>
                    <div className={'ratio ratio-1x1 rounded-circle border overflow-hidden ' + (directorImageLoaded ? '' : 'placeholder')} style={{ minWidth: '20%', maxWidth: '20%' }}>
                        <img className={'mx-auto ' + (directorImageLoaded ? '' : 'd-none')} src={`data:${directorImage.type};base64,${directorImage.data}`} alt="Director Icon" style={{ objectFit: 'cover' }} />
                    </div>
                    <p className="mb-0">{props.film.directorFirstName}</p>
                    <p className="mb-0">{props.film.directorLastName}</p>
                </div>

            </div>

        </a >
    )

}

export default FilmCard;