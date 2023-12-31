import React from "react"
import DirectorCard from "../components/DirectorCard"
import axios from "axios"
import NotFound from "./NotFound"
import { useNavigate, useParams } from "react-router-dom"
import default_film_picture from "../assets/default_film_picture.png";
import { Buffer } from "buffer";
import ReviewsPanel from "../components/ReviewsPanel"
import ViewFilmPlaceholder from "./placeholder/ViewFilmPlaceholder"
import SimilarFilms from "../components/SimilarFilms"
import Restricted from "../layouts/Restricted"
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OnlineContext } from "../util/Contexts"


const ViewFilm = (props: any) => {
    const { filmId } = useParams()
    const [film, setFilm] = React.useState<Film>()
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [notFoundFlag, setNotFoundFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [genre, setGenre] = React.useState<Genre>();
    const [heroImage, setHeroImage] = React.useState<string>("");
    const [genreLoaded, setGenreLoaded] = React.useState<boolean>(false);
    const [heroImageLoaded, setHeroImageLoaded] = React.useState<boolean>(false);
    const [isOnline] = React.useContext(OnlineContext);
    const [deleteConfirmed, setDeleteConfirmed] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getFilm = () => {
            setNotFoundFlag(false)
            axios.get(process.env.REACT_APP_DOMAIN + "/films/" + filmId)
                .then((response) => {
                    setErrorFlag(false)
                    setFilm(response.data)
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
                }, (error) => {
                    console.log(error)

                    if (error.response.status === 404 || error.response.status === 400) {
                        setNotFoundFlag(true)
                        setLoading(false)
                    } else if (error.code !== "ERR_NETWORK") {
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
                    setGenreLoaded(true)
                    // Genre has default value from useState
                })
        }

        getGenre()
    }, [film, isOnline])

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
        if (loading) {
            getHeroImage()
        }
    }, [filmId, isOnline, loading])

    React.useEffect(() => {
        const remove = () => {
            axios.delete(process.env.REACT_APP_DOMAIN + `/films/${film?.filmId}`)
                .then((response) => {
                    navigate('/films')
                }, (err) => {
                    switch (err.response.status) {
                        case 401:
                            navigate('/logout', { replace: true })
                            break
                        case 404:
                        case 403:
                            navigate('/films', { replace: true }) // Doesn't exist or no permission so user should not be on the page
                            break;
                        default:
                            setErrorFlag(true)
                            setErrorMessage(err.message)
                    }
                })
        }

        if (deleteConfirmed) {
            remove()
        }

    }, [deleteConfirmed, film?.filmId, navigate])

    const formatRuntime = (runtime: number) => {
        return ((runtime < 60) ? `${runtime}m` : `${Math.floor(runtime / 60)}h ${runtime % 60}m`)
    }

    const film_details = (film: Film) => {
        return (
            <div className='d-flex flex-column justify-content-center bg-light col-12 col-sm-5 col-lg-12 col-xxl-12 border rounded-3 p-3 my-sm-0 my-3 me-xxl-5'>
                <h3 className='fs-4 text-decoration-underline'>Details</h3>
                <div className='d-flex flex-column justify-content-start'>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Genre:</p>
                        <p className={'col-5 text-start ' + (genreLoaded ? '' : 'placeholder')}>{(genreLoaded) ? genre?.name : genre?.genreId}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Age Rating:</p>
                        <p className='col-5 text-start'>{film.ageRating}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Runtime:</p>
                        <p className='col-5 text-start'>{(film.runtime) ? formatRuntime(film.runtime) : 'Not Available'}</p>
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

    if (!isOnline && loading) {
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

    if (!film || notFoundFlag) {
        return (<NotFound />)
    }

    return (
        <div>
            {(timedOut) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}

            <div className="d-flex flex-column align-items-center align-items-sm-center p-4 placeholder-glow">
                <div className="d-flex flex-row col-12">
                    <h1 className='fs-1 text-secondary ps-xxl-4 mb-3 col-8 col-md-9 col-lg-10 text-start text-capitalize text-break'>{film.title}</h1>
                    <div className='col-4 col-md-3 col-lg-2'>
                        <Restricted whitelist={[film.directorId]}>
                            <div className='d-flex flex-column flex-sm-row justify-content-end'>
                                {(film.numReviews === 0) ?
                                    <button className={'btn btn-outline-primary'} onClick={() => { navigate('edit', { replace: true }) }}>Edit</button>
                                    :
                                    <OverlayTrigger placement="left" overlay={<Tooltip>Cannot edit film after a review has been placed</Tooltip>}>
                                        <span className='d-block'>
                                            <button className={'btn btn-outline-primary'} disabled>Edit</button>
                                        </span>
                                    </OverlayTrigger>
                                }

                                <button className={'btn btn-danger mt-2 mt-sm-0 ms-sm-2'} type='button' data-bs-toggle='modal' data-bs-target='#deleteFilmModal'>Delete</button>

                                <div className="modal fade" id={'deleteFilmModal'} tabIndex={-1} role="dialog" aria-labelledby={'deleteFilmModelLabel'} aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id={'deleteFilmModelLabel'}>Delete Film</h5>
                                                <button type="button" className="btn close" data-bs-dismiss="modal" aria-label="Close">
                                                    <i className="bi bi-x-lg" aria-hidden='true'></i>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure that you want to delete the film <span className='text-danger text-capitalize'>{film?.title}</span>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { setDeleteConfirmed(true) }}>
                                                    Delete Film
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Restricted>
                    </div>
                </div>
                <div className='d-flex flex-column col-12 flex-lg-row  align-items-center justify-content-lg-between justify-content-xxl-center'>
                    <div className='d-flex flex-column col-12 col-sm-8 col-lg-4 col-xxl-4 mb-3 align-items-center me-xxl-5 img-thumbnail'>
                        <div className={'ratio ratio-1x1 ' + (heroImageLoaded ? '' : 'placeholder')} >
                            <img className={'mx-auto ratio ratio-1x1 ' + ((!heroImageLoaded) ? 'placeholder' : '')} src={(heroImageLoaded ? heroImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Film Hero" style={{ objectFit: 'cover' }} />
                        </div>
                    </div>

                    <div className='d-flex flex-column flex-sm-row-reverse flex-lg-column col-12 col-lg-7 col-xxl-7 justify-content-sm-around justify-content-xxl-center align-items-center m-sm-3 mt-lg-0'>
                        <div className='d-flex flex-column col-12 col-sm-6 col-lg-12 col-xxl-12'>
                            <p className="d-inline-block col-12 text-dark text-start text-wrap text-break"><b>Description: </b>{film.description}</p>

                            <div className='d-flex flex-column col-12 col-md-8 col-lg-5 col-xl-5 col-xxl-4 mb-3'>
                                <p className='align-self-start fw-bold'>Director:</p>
                                <div className='bg-light rounded-3'>
                                    <DirectorCard director={{ id: film.directorId, firstName: film.directorFirstName, lastName: film.directorLastName }} />
                                </div>
                            </div>
                        </div>

                        {film_details(film)}
                    </div>
                </div>

                <div className='d-flex flex-column mb-4 col-12 col-xxl-8'>
                    <ReviewsPanel filmId={filmId} directorId={film.directorId} rating={film.rating} releaseDate={film.releaseDate} />
                </div>

                <div className='d-flex flex-column col-12 col-md-5 col-lg-8 col-xxl-6'>
                    <SimilarFilms filmId={film.filmId} directorId={film.directorId} genreId={film.genreId} />
                </div>

            </div >
        </div>
    )

}

export default ViewFilm