import React from "react"
import DirectorCard from "../components/DirectorCard"
import axios from "axios"
import NotFound from "./NotFound"
import { useParams } from "react-router-dom"
import default_film_picture from "../assets/default_film_picture.png";
import { Buffer } from "buffer";
import ReviewsPanel from "../components/ReviewsPanel"
import ViewFilmPlaceholder from "./placeholder/ViewFilmPlaceholder"



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
    const [isOnline, setIsOnline] = React.useState(navigator.onLine)


    // Handler modified to only 'trigger' on the change from offline>online to preserve page content
    React.useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
            setLoading(true);
        };

        window.addEventListener("online", handleStatusChange)

        return () => {
            window.removeEventListener('online', handleStatusChange);
        }
    }, [isOnline])


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
    }, [filmId, isOnline])

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
    }, [filmId, isOnline])

    const formatRuntime = (runtime: number) => {
        return ((runtime < 60) ? `${runtime}m` : `${Math.floor(runtime / 60)}h ${runtime % 60}m`)
    }

    const film_details = (film: Film) => {
        return (
            <div className='d-flex flex-column justify-content-center bg-light col-12 col-sm-5 col-lg-12 col-xxl-3 border rounded-3 p-3 my-sm-0 my-3 me-xxl-5'>
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
                        <p className='col-5 text-start'>{formatRuntime(film.runtime)}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Release Date:</p>
                        <p className='col-5 text-start'>{new Date(film.releaseDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        )
    }


    const error_offline = () => {
        return (
            <div className="alert alert-danger" role="alert">
                We are having trouble connecting to the internet. Check your network settings or click <a href={window.location.href} className="alert-link">here</a> to try again.
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

    if (!isOnline) {
        console.log('offline trigger')
        return (
            <div className="d-flex flex-column">
                {error_offline()}
                {<ViewFilmPlaceholder />}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="d-flex flex-column">
                {(timedOut) ? error_timed_out() : ''}
                {(errorFlag) ? error_unexpected() : ''}
                {<ViewFilmPlaceholder />}
            </div>
        )
    }

    if (!film) {
        return (<NotFound />)
    }

    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center p-4 placeholder-glow">
            {(timedOut) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}
            <h1 className='fs-1 text-secondary align-self-center mb-3'>{film.title}</h1>
            <div className='d-flex flex-column col-12 flex-lg-row flex-xxl-column align-items-center justify-content-lg-between justify-content-xxl-center'>
                <div className='d-flex flex-column col-12 col-sm-10 col-lg-4 col-xxl-3 mb-3 align-items-center me-xxl-5'>
                    <div className='d-flex flex-column align-self-center col-sm-10 col-lg-12 mb-3 mb-sm-0'>
                        <img className={'img-fluid img-thumbnail ' + ((!heroImageLoaded) ? 'placeholder' : '')} src={(heroImageLoaded ? heroImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Film Hero" />
                    </div>
                </div>
                <div className='d-flex flex-column flex-sm-row-reverse flex-lg-column flex-xxl-row-reverse col-12 col-lg-7 col-xxl-12 justify-content-sm-around justify-content-xxl-center align-items-center m-sm-3 mt-lg-0'>
                    <div className='d-flex flex-column col-12 col-sm-6 col-lg-12 col-xxl-4'>
                        <p className="d-inline-block col-12 text-dark text-start text-wrap text-break"><b>Description: </b>{film.description}</p>

                        <div className='d-flex flex-column col-12 col-md-8 col-lg-5 col-xl-5 col-xxl-6 mb-3'>
                            <p className='align-self-start fw-bold'>Director:</p>
                            <div className='bg-light rounded-3'>
                                <DirectorCard director={{ id: film.directorId, firstName: film.directorFirstName, lastName: film.directorLastName }} />
                            </div>
                        </div>
                    </div>

                    {film_details(film)}
                </div>
            </div>
            <div className='d-flex flex-column col-12 col-xxl-8'>
                <ReviewsPanel filmId={filmId} rating={film.rating} />
            </div>
        </div >
    )

}

export default ViewFilm