import axios from "axios";
import React from "react";
import { Buffer } from "buffer";
import default_film_picture from "../assets/default_film_picture.png";
import DirectorCard from "./DirectorCard";

const FilmCard = (props: any) => {

    const [genre, setGenre] = React.useState<Genre>({ genreId: 0, name: "Unknown" });
    const [heroImage, setHeroImage] = React.useState<string>("");
    const [genreLoaded, setGenreLoaded] = React.useState<boolean>(false);
    const [heroImageLoaded, setHeroImageLoaded] = React.useState<boolean>(false);
    React.useEffect(() => {
        const getGenre = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
                .then((response) => {
                    setGenre(response.data.filter((g: Genre) => g.genreId === props.film.genreId)[0]);
                    setGenreLoaded(true)
                }, (error) => {
                    console.log(error)
                    // Genre has default value from useState
                })
        }

        getGenre()
    }, [props.film.genreId])

    React.useEffect(() => {
        const getHeroImage = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + props.film.filmId + '/image', { responseType: "arraybuffer" })
                .then((response) => {
                    setHeroImage(`data: ${response.headers['content-type']}; base64, ${Buffer.from(response.data, 'binary').toString('base64')}`);
                    setHeroImageLoaded(true)
                }, (error) => {
                    setHeroImage(default_film_picture);
                    setHeroImageLoaded(true);
                })
        }

        getHeroImage()
    }, [props.film.filmId])


    return (
        <a href={'/films/' + props.film.filmId} className={'card d-flex flex-column flex-lg-row justify-content-center align-items-lg-center text-decoration-none text-dark mb-3 col-12 ' + (heroImageLoaded ? '' : 'placeholder-glow')}>
            <div className="d-flex col-12 col-lg-5 img-thumbnail">
                <div className={'ratio ratio-1x1 ' + (heroImageLoaded ? '' : 'placeholder')} >
                    <img className={'mx-auto ratio ratio-1x1 ' + (heroImageLoaded ? '' : 'invisible')} src={(heroImageLoaded ? heroImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Hero" style={{ boxSizing: 'border-box', objectFit: 'cover' }} />
                </div>
            </div>

            <div className="card-body d-flex flex-column justify-content-around align-items-center col-lg-7 col-xl-3">
                <h5 className="card-title display">{props.film.title}</h5>

                <div className="d-flex flex-column flex-md-row justify-content-around p-2 mb-2">
                    <div className="d-flex flex-column mb-3 me-3">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Age Rating</p>
                            <p className="card-text">{props.film.ageRating}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Avg. Rating</p>
                            <p className="card-text">{props.film.rating}</p>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="mb-3 placeholder-glow ">
                            <p className="card-text mb-1 fw-bold">Genre</p>
                            <p className={'card-text ' + (genreLoaded ? '' : 'placeholder col-10')}>{genre.name}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Release Date</p>
                            <p className="card-text">{new Date(props.film.releaseDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>


                <div className="border-top col-8 col-sm-10">
                    <DirectorCard director={{ id: props.film.directorId, firstName: props.film.directorFirstName, lastName: props.film.directorLastName }} />
                </div>
            </div>

        </a >
    )

}

export default FilmCard;