import axios from "axios"
import React from "react"
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { AuthContext } from "../util/Contexts";

const EditFilm = () => {
    const navigate = useNavigate();
    const { filmId } = useParams();
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [newHeroImage, setNewHeroImage] = React.useState<File>()
    const [film, setFilm] = React.useState<Film>()
    const [titleError, setTitleError] = React.useState<string>('Please enter a valid title less than 64 characters')
    const [releaseDateError, setReleaseDateError] = React.useState<string>('Please enter a date that is not in the past.')
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false)
    const [isOnline, setIsOnline] = React.useState(navigator.onLine)
    const [notFoundFlag, setNotFoundFlag] = React.useState(false)
    const [timedOut, setTimedOut] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [activeUser] = React.useContext(AuthContext)


    const [genres, setGenres] = React.useState<Genre[]>([]);
    const form = React.useRef<HTMLFormElement>(null)
    const title = React.useRef<HTMLInputElement>(null)
    const genre = React.useRef<HTMLSelectElement>(null)
    const ageRating = React.useRef<HTMLSelectElement>(null)
    const runtime = React.useRef<HTMLInputElement>(null)
    const releaseDate = React.useRef<HTMLInputElement>(null)
    const description = React.useRef<HTMLTextAreaElement>(null)
    const image = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (film?.numReviews as number > 0 || activeUser !== film?.directorId) {
            navigate(-1)
        }
    }, [activeUser, film, navigate])

    // Handler modified to only 'trigger' on the change from offline>online to preserve page content
    React.useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", handleStatusChange)
        window.addEventListener("offline", handleStatusChange)

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);

        }
    }, [isOnline])


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
                        // setErrorMessage(error.response.statusText)
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
                    setGenres(response.data)
                }, (error) => {
                    console.log(error)
                    // Genre has default value from useState
                })
        }

        getGenre()
    }, [])

    const validate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        title.current?.classList.remove('is-valid')
        title.current?.classList.remove('is-invalid')

        genre.current?.classList.remove('is-valid')
        genre.current?.classList.remove('is-invalid')

        ageRating.current?.classList.remove('is-valid')
        ageRating.current?.classList.remove('is-invalid')

        runtime.current?.classList.remove('is-valid')
        runtime.current?.classList.remove('is-invalid')

        releaseDate.current?.classList.remove('is-valid')
        releaseDate.current?.classList.remove('is-invalid')

        description.current?.classList.remove('is-valid')
        description.current?.classList.remove('is-invalid')

        image.current?.classList.remove('is-valid')
        image.current?.classList.remove('is-invalid')

        if (!form.current?.checkValidity()) {
            form.current?.classList.add('was-validated')
            setSubmitted(false)
        } else {
            form.current?.classList.remove('was-validated')
            if (image.current?.files?.item(0)) {
                setNewHeroImage(image.current?.files?.item(0) as File)
            }
            setSubmitted(true)
        }
    }

    React.useEffect(() => {
        if (!submitted) {
            return
        }

        const edit = () => {
            axios.patch(process.env.REACT_APP_DOMAIN + `/films/${film?.filmId}`, {
                ...(title.current?.value !== film?.title && { title: title.current?.value }),
                ...(genre.current?.value !== film?.genreId && { genreId: parseInt(genre.current?.value as string, 10) }),
                ...(ageRating.current?.value !== film?.ageRating && { ageRating: ageRating.current?.value }),
                ...(runtime.current?.value && parseInt(runtime.current.value, 10) !== film?.runtime && { runtime: parseInt(runtime.current.value, 10) }),
                ...(releaseDate.current?.value && releaseDate.current.value !== film?.releaseDate.split('T')[0] && { releaseDate: releaseDate.current.value + ' 23:59:59' }),
                ...(description.current?.value !== film?.description && { description: description.current?.value })
            }).then((response) => {
                if (!newHeroImage) {
                    navigate(`/films/${film?.filmId}`)
                } else {
                    postImage()
                }
            }, (err) => {
                console.log(err)
                setSubmitted(false)

                if (err.code === 'ERR_NETWORK') {
                    return
                }

                switch (err.response.status) {
                    case 401:
                        navigate('/logout')
                        break
                    case 400:
                        title.current?.classList.add(((err.response.statusText as string).includes('data/title')) ? 'is-invalid' : 'is-valid')
                        setTitleError('Please enter a valid title less than 64 characters')
                        genre.current?.classList.add(((err.response.statusText as string).includes('data/genreId')) ? 'is-invalid' : 'is-valid')
                        ageRating.current?.classList.add(((err.response.statusText as string).includes('data/ageRating')) ? 'is-invalid' : 'is-valid')
                        runtime.current?.classList.add(((err.response.statusText as string).includes('data/runtime')) ? 'is-invalid' : 'is-valid')
                        releaseDate.current?.classList.add(((err.response.statusText as string).includes('data/releaseDate')) ? 'is-invalid' : 'is-valid')
                        setReleaseDateError('Please enter a date that is not in the past.')
                        description.current?.classList.add(((err.response.statusText as string).includes('data/description')) ? 'is-invalid' : 'is-valid')
                        break;
                    case 403:
                        if ((err.response.statusText as string).toLowerCase().includes('duplicate')) {
                            title.current?.classList.add('is-invalid')
                            setTitleError('Film with this title already exists')
                        }
                        if ((err.response.statusText as string).toLowerCase().includes('past')) {
                            releaseDate.current?.classList.add('is-invalid')
                            setReleaseDateError('Please enter a date that is not in the past.')
                        }
                        if ((err.response.statusText as string).toLowerCase().includes('film already released')) {
                            releaseDate.current?.classList.add('is-invalid')
                            setReleaseDateError('Cannot change the release date of a film that has already passed')
                        }
                        if ((err.response.statusText as string).toLowerCase().includes('review')) {
                            navigate(`/films/${film?.filmId}`)
                        }
                        break
                    default:
                        setErrorFlag(true)
                        break
                }
            })
        }


        const postImage = () => {
            axios.put(process.env.REACT_APP_DOMAIN + `/films/${film?.filmId}/image`,
                newHeroImage, {
                headers: {
                    'Content-Type': newHeroImage?.type
                }
            })
                .then((response) => {
                    navigate(`/films/${film?.filmId}`)
                }, (err) => {
                    console.log(err)
                    navigate(`/films/${film?.filmId}`)
                })
        }

        if (newHeroImage && !(newHeroImage?.type === 'image/png' || newHeroImage?.type === 'image/gif' || newHeroImage?.type === 'image/jpg' || newHeroImage?.type === 'image/jpeg')) {
            image.current?.classList.add('is-invalid');
            setSubmitted(false)

            return
        } else {
            image.current?.classList.add('is-valid');
        }

        edit()
    }, [film, navigate, newHeroImage, submitted])



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
                An unexpected error occurred. Please try again
            </div>
        )
    }

    if (notFoundFlag) {
        return <NotFound />
    }

    return (
        <div className='d-flex flex-column col-12'>

            {(errorFlag) ? error_unexpected() : ''}
            {(timedOut && isOnline) ? error_timed_out() : ''}
            {(!isOnline) ? error_offline() : ''}

            <div className={"spinner-border position-absolute align-self-center " + ((loading || submitted) ? 'd-flex' : 'd-none')} style={{ width: '4rem', height: '4rem', top: '40%' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>

            <div className={'d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100 ' + ((loading || submitted || !isOnline) ? 'opacity-25' : '')} >

                <div className='mb-3'>
                    <h1>Edit Film</h1>
                </div>

                <form ref={form} className='d-flex flex-column col-10 col-md-6 ' onSubmit={validate} id='editFilmForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFilmTitle" className="form-label">Title</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <input ref={title} type="text" className="form-control" id="editFilmTitle" maxLength={64} defaultValue={(film) ? film.title : ''} aria-describedby={'editFilmTitleInvalid'} autoFocus={true} required disabled={loading || submitted || !isOnline} />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='editFilmFNameInvalid'>
                                {titleError}
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFilmGenre" className="form-label">Genre</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <select key={genres.toString() + film?.genreId} ref={genre} className="form-select" aria-label="Select a genre" defaultValue={(film) ? film.genreId : ''} required disabled={loading || submitted || !isOnline}>
                                <option value='' disabled>Select...</option>
                                {genres.map((genre) => {
                                    return (
                                        <option key={genre.genreId} value={genre.genreId}>{genre.name}</option>
                                    )
                                })}
                            </select>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Please select a genre
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-around">
                        <div className='d-flex flex-column col-12 col-lg-3 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFilmAgeRating" className="form-label">Age Rating</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <select key={film?.ageRating} ref={ageRating} className="form-select" defaultValue={(film) ? film.ageRating : ''} aria-label="Select a age rating" disabled={loading || submitted || !isOnline}>
                                <option value="" disabled>Select...</option>
                                {['TBC', 'G', 'PG', 'M', 'R13', 'R16', 'R18'].map((r: string) => {
                                    return (
                                        <option key={r} value={r}>{r}</option>
                                    )
                                })}
                            </select>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='editFilmAgeRatingInvalid'>
                                Please select a valid option
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-3 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFilmRuntime" className="form-label">Runtime (mins)</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <input ref={runtime} type="number" className="form-control" defaultValue={(film) ? film.runtime : ''} id="editFilmRuntime" min={1} max={300} disabled={loading || submitted || !isOnline} />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Please enter a valid runtime between 1-300 minutes
                            </div>
                        </div>
                        <div className='d-flex flex-column col-12 col-lg-3 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFilmReleaseDate" className="form-label">Release Date</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <input ref={releaseDate} type="date" defaultValue={(film) ? film?.releaseDate.split('T')[0] : ''} className="form-control d-flex justify-content-center align-items-center" id="editFilmReleaseDate" min={new Date(Date.now()).toISOString().split('T')[0]} disabled={loading || submitted || !isOnline || Date.parse(film?.releaseDate as string) < Date.now()} />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                {releaseDateError}
                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editFilmEmail" className="form-label">Description</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <textarea ref={description} className="form-control" defaultValue={(film) ? film?.description : ''} id="editFilmDescription" maxLength={512} required disabled={loading || submitted || !isOnline} />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            Please enter a description less than 512 characters
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editFilmProfilePicture" className="form-label">Upload Hero Image</label>
                            <span className='fs-6 text-muted'>optional</span>
                        </div>
                        <input ref={image} type="file" className="form-control" accept="image/png,image/gif,image/jpeg, image/jpg" id="editFilmHeroImage" disabled={loading || submitted || !isOnline} />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            File must be one of the following: png, gif, jpeg
                        </div>
                    </div>
                    <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                        <button type="button" onClick={() => { navigate(`/films/${film?.filmId}`) }} className="btn btn-outline-secondary col-12 col-lg-5" disabled={loading || submitted || !isOnline}>Cancel</button>
                        <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0" disabled={loading || submitted}>Update</button>
                    </div>
                </form >
            </div >
        </div >
    )
}

export default EditFilm