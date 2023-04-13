import axios from "axios"
import React from "react"
import { useNavigate } from "react-router-dom";

const CreateFilm = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [newHeroImage, setNewHeroImage] = React.useState<File>()
    const [newFilmId, setNewFilmId] = React.useState<number>(0)
    const [connectionFlag, setConnectionFlag] = React.useState<boolean>(false)
    const [titleError, setTitleError] = React.useState<string>('Please enter a valid title less than 64 characters')
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false)

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
            setNewHeroImage(image.current?.files?.item(0) as File)
            setSubmitted(true)
        }
    }

    React.useEffect(() => {
        if (!submitted) {
            return
        }

        const create = () => {
            setConnectionFlag(false)
            axios.post(process.env.REACT_APP_DOMAIN + '/films', {
                title: title.current?.value,
                genreId: parseInt(genre.current?.value as string),
                ...(ageRating.current?.value !== '' && { ageRating: ageRating.current?.value }),
                ...(runtime.current?.value && { runtime: parseInt(runtime.current?.value) }),
                ...(releaseDate.current?.value && { releaseDate: releaseDate.current?.value + ' 00:00:00' }),
                description: description.current?.value
            }).then((response) => {
                setNewFilmId(response.data.filmId);
            }, (err) => {
                console.log(err)
                setSubmitted(false)

                if (err.code === 'ERR_NETWORK') {
                    setConnectionFlag(true)
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
                        description.current?.classList.add(((err.response.statusText as string).includes('data/description')) ? 'is-invalid' : 'is-valid')
                        break;
                    case 403:
                        if ((err.response.statusText as string).toLowerCase().includes('duplicate')) {
                            title.current?.classList.add('is-invalid')
                            setTitleError('Film with this title already exists')
                        }
                        if ((err.response.statusText as string).toLowerCase().includes('past')) {
                            releaseDate.current?.classList.add('is-invalid')
                        }
                        break
                    default:
                        setErrorFlag(true)
                        break
                }
            })
        }

        if (!(newHeroImage?.type === 'image/png' || newHeroImage?.type === 'image/gif' || newHeroImage?.type === 'image/jpg' || newHeroImage?.type === 'image/jpeg')) {
            image.current?.classList.add('is-invalid');
            setSubmitted(false)

            return
        } else {
            image.current?.classList.add('is-valid');
        }

        create()
    }, [navigate, newHeroImage, submitted])


    React.useEffect(() => {

        if (!submitted || newFilmId === 0) {
            return
        }
        const postImage = () => {
            axios.put(process.env.REACT_APP_DOMAIN + `/films/${newFilmId}/image`,
                newHeroImage, {
                headers: {
                    'Content-Type': newHeroImage?.type
                }
            })
                .then((response) => {
                    navigate(`/films/${newFilmId}`)
                }, (err) => {
                    console.log(err)
                    navigate(`/films/${newFilmId}`)
                })
        }

        postImage()
    }, [navigate, newFilmId, newHeroImage, submitted])


    return (
        <div>
            {(connectionFlag) ?
                <div className="alert alert-danger" role="alert">
                    Unable to connect to the internet. Please try again
                </div>
                : ''}

            {(errorFlag) ?
                <div className="alert alert-danger" role="alert">
                    An unexpected error occurred. Please try again
                </div>
                : ''}

            <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100' >

                <div className='mb-3'>
                    <h1>Create Film</h1>
                </div>

                <form ref={form} className='d-flex flex-column col-10 col-md-6 ' onSubmit={validate} id='createFilmForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="createFilmTitle" className="form-label">Title</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <input ref={title} type="text" className="form-control" id="createFilmTitle" maxLength={64} placeholder={'My New Film'} aria-describedby={'createFilmTitleInvalid'} autoFocus={true} required />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='createFilmFNameInvalid'>
                                {titleError}
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="createFilmGenre" className="form-label">Genre</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <select ref={genre} className="form-select" aria-label="Select a genre" defaultValue='' required>
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
                                <label htmlFor="createFilmAgeRating" className="form-label">Age Rating</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <select ref={ageRating} className="form-select" defaultValue={''} aria-label="Select a age rating">
                                <option value="">Select...</option>
                                {['TBC', 'G', 'PG', 'M', 'R13', 'R16', 'R18'].map((r: string) => {
                                    return (
                                        <option key={r} value={r}>{r}</option>
                                    )
                                })}
                            </select>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='createFilmAgeRatingInvalid'>
                                Please select a valid option
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-3 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="createFilmRuntime" className="form-label">Runtime (mins)</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <input ref={runtime} type="number" className="form-control" id="createFilmRuntime" min={1} max={300} />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Please enter a valid runtime between 1-300 minutes
                            </div>
                        </div>
                        <div className='d-flex flex-column col-12 col-lg-3 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="createFilmReleaseDate" className="form-label">Release Date</label>
                                <span className='fs-6 text-muted'>optional</span>
                            </div>
                            <input ref={releaseDate} type="date" className="form-control d-flex justify-content-center align-items-center" id="createFilmReleaseDate" min={new Date(Date.now()).toISOString().split('T')[0]} />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Please enter a date that is not in the past
                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="createFilmEmail" className="form-label">Description</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <textarea ref={description} className="form-control" id="createFilmDescription" maxLength={512} placeholder={'Tell us about your film...'} required />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            Please enter a description less than 512 characters
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="createFilmProfilePicture" className="form-label">Upload Hero Image</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <input ref={image} type="file" className="form-control" accept="image/png,image/gif,image/jpeg, image/jpg" id="createFilmHeroImage" required />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            File must be one of the following: png, gif, jpeg
                        </div>
                    </div>
                    <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                        <button type="reset" className="btn btn-outline-secondary col-12 col-lg-5">Clear</button>
                        <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0">Submit</button>
                    </div>
                </form >
            </div >
        </div>
    )
}

export default CreateFilm