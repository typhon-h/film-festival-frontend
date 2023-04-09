import React from "react"
import DirectorCard from "../components/DirectorCard"
import axios from "axios"
import NotFound from "./NotFound"
import { useParams } from "react-router-dom"
import default_film_picture from "../assets/default_film_picture.png";
import { Buffer } from "buffer";



const ViewFilm = (props: any) => {
    const { filmId } = useParams()
    const [film, setFilm] = React.useState<Film>()
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [genre, setGenre] = React.useState<Genre>({ genreId: 0, name: "Unknown" });
    const [heroImage, setHeroImage] = React.useState<string>("");
    const [genreLoaded, setGenreLoaded] = React.useState<boolean>(false);
    const [heroImageLoaded, setHeroImageLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getFilm = () => {
            axios.get(process.env.REACT_APP_DOMAIN + "/films/" + filmId)
                .then((response) => {
                    setErrorFlag(false)
                    setFilm(response.data)
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
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

        getFilm()
    }, [filmId])

    React.useEffect(() => {
        const getGenre = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
                .then((response) => {
                    setGenre(response.data.filter((g: Genre) => g.genreId === film?.genreId)[0]);
                    setGenreLoaded(true)
                }, (error) => {
                    console.log(error)
                    // Genre has default value from useState
                })
        }

        getGenre()
    }, [film])

    React.useEffect(() => {
        const getHeroImage = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + filmId + '/image', { responseType: "arraybuffer" })
                .then((response) => {
                    setHeroImage(`data: ${response.headers['content-type']}; base64, ${Buffer.from(response.data, 'binary').toString('base64')}`);
                    setHeroImageLoaded(true)
                }, (error) => {
                    setHeroImage(default_film_picture);
                    setHeroImageLoaded(true);
                })
        }

        getHeroImage()
    }, [filmId])

    if (!film) {
        return (<NotFound />)
    }

    return (
        <div className="d-flex flex-column align-items-start p-4">
            <h1 className='fs-1 text-secondary align-self-center'>{film.title}</h1>
            <div className='d-flex flex-column align-self-center'>
                <img className='img-fluid img-thumbnail' src={(heroImageLoaded ? heroImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Film Hero" />
            </div>
            <p className="d-inline-block w-100 text-dark text-start text-wrap text-break"><b>Description: </b>{film.description}</p>
            <div className='d-flex flex-column w-100'>
                <p className='align-self-start fw-bold'>Director:</p>
                <DirectorCard director={{ id: film.directorId, firstName: film.directorFirstName, lastName: film.directorLastName }} />
            </div>

            <div className='d-flex flex-column bg-light w-100 border rounded-3 p-3 my-3'>
                <h3 className='fs-4 text-decoration-underline'>Details</h3>
                <div className='d-flex flex-column justify-content-start'>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Genre:</p>
                        <p className={'col-5 text-start ' + (genreLoaded ? '' : 'placeholder')}>{(genre) ? genre.name : ''}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Age Rating:</p>
                        <p className='col-5 text-start'>{film.ageRating}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Runtime:</p>
                        <p className='col-5 text-start'>{film.runtime}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Release Date:</p>
                        <p className='col-5 text-start'>{new Date(film.releaseDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className='w-100 d-flex flex-column'><span className='col-12 bg-warning'>REVIEWS</span></div>

        </div >
    )

}

export default ViewFilm