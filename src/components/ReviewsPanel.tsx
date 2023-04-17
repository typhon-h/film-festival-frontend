import axios from "axios"
import React from "react"
import DirectorCard from "./DirectorCard"
import Restricted from "../layouts/Restricted"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../util/Contexts"

const ReviewsPanel = (props: any) => {
    const [reviews, setReviews] = React.useState<Review[]>([])
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [postErrorMessage, setPostErrorMessage] = React.useState("")
    const [postErrorFlag, setPostErrorFlag] = React.useState(false)
    const [expanded, setExpanded] = React.useState(false);
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [activeUser] = React.useContext(AuthContext)
    const [reviewsLoaded, setReviewsLoaded] = React.useState<boolean>(false)
    const navigate = useNavigate()


    const form = React.useRef<HTMLFormElement>(null)
    const review = React.useRef<HTMLTextAreaElement>(null)
    const rating = React.useRef<HTMLInputElement>(null)


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getReviews = () => {
            axios.get(process.env.REACT_APP_DOMAIN + "/films/" + props.filmId + "/reviews")
                .then((response) => {
                    setErrorFlag(false)
                    setReviews(response.data)
                    clearTimeout(timer)
                    setTimedOut(false)
                    setReviewsLoaded(true)
                }, (error) => {
                    console.log(error)
                    setErrorFlag(true)

                    if (error.code !== "ERR_NETWORK") {

                        setErrorMessage("An error occurred while fetching reviews. Please try again")
                    }

                    clearTimeout(timer)
                    setTimedOut(false)

                })
        }
        getReviews()
    }, [props.filmId])


    React.useEffect(() => {
        // Re-renders drop down to update button text arrow direction
        return;

    }, [expanded])


    const toggleExpanded = () => {
        setExpanded(document.getElementById('reviewPanel')?.ariaExpanded === 'true');
    }


    const display_reviews = () => {
        return reviews.map((review, index) =>
            <div key={review.reviewerId} className={'d-flex flex-column border-bottom border-3 col-12 text-break ' + ((index % 2 === 0) ? 'bg-body' : 'bg-light')}>
                {(review.review) ? <span className='w-100 p-2 fs-6 fst-italic text-start border-1 border-bottom'>"{review.review}"</span> : ''}
                <div className='d-flex flex-row justify-content-between align-items-center py-2 px-4'>
                    <span className='col-3 fs-6 text-muted'><span className='fs-1 fw-medium pe-1 text-dark'>{review.rating}</span>/ 10</span>
                    <div className='col-8 col-sm-5 col-lg-3 border-1'>
                        <DirectorCard director={{ id: review.reviewerId, firstName: review.reviewerFirstName, lastName: review.reviewerLastName }}></DirectorCard>
                    </div>
                </div>
            </div>

        )
    }

    const render_reviews = () => {

        if (timedOut) { // Should never get here, slow network will be monitored at page level
            return (
                <div className='p-2'>
                    <div className="spinner-border" role="status">
                    </div>
                </div>
            )
        } else if (errorFlag) {
            return (
                <span className="text-muted fst-italic">{errorMessage}</span>
            )
        } else if (reviews.length === 0) {
            return (
                <span className="text-muted fst-italic">No Reviews Available</span>
            )
        } else {
            return display_reviews()
        }
    }

    const review_form = () => {
        return (
            <div className='position-relative'>
                {
                    (activeUser) ? '' :
                        <div className='position-absolute top-50 start-50 translate-middle w-100 fs-5' style={{ zIndex: 1 }}>
                            You must have an account to leave a review
                            <br />
                            <span className='fs-5 fw-normal text-muted'><a className='link-primary fs-4' href='/login'>Log into an existing account</a> or <a className='link-primary fs-4' href='/register'>Create a new one here</a></span>
                        </div>
                }
                <form ref={form} className={'d-flex flex-column align-items-center border border-top-0 col-12 p-2 needs-validation  ' + ((activeUser) ? '' : 'opacity-25')} onSubmit={validate} noValidate>
                    <h5 className='text-muted fs-4'>Review it yourself</h5>
                    <div className='d-flex flex-row justify-content-between px-1 col-12'>
                        <label className='form-label' htmlFor="postReviewTextArea">Textual Review</label>
                        <span className='text-secondary '>optional</span>
                    </div>
                    <textarea ref={review} id="postReviewTextArea" className='form-control text-start border-1 border-bottom' placeholder="Type your review here..." maxLength={512} disabled={!activeUser}></textarea>
                    <div className="invalid-feedback text-end" >
                        Review must be less than 512 characters
                    </div>
                    <div className='d-flex flex-column flex-sm-row justify-content-between align-items-center py-2 px-4 col-12'>
                        <span className='col-5 col-sm-5 col-md-3 fs-6 text-muted d-flex flex-row mb-2 mb-sm-0 justify-content-center'>
                            <span>Rating:</span>
                            <div className='d-flex flex-column col-4 mx-2 align-items-center'>
                                <input ref={rating} id={'reviewRating'} type='number' min={1} max={10} className='fs-2 text-center fw-medium pe-1 text-dark col-12' required disabled={!activeUser} />
                                <div className="invalid-feedback text-nowrap" >
                                    Rating must be 1-10
                                </div>
                            </div>
                            <span className=''>/10</span>
                        </span>
                        <div className='col-12 col-sm-5 col-lg-3 border-1'>
                            {(activeUser) ? <button className='btn btn-success col-12' type='submit' >Post</button>
                                : ''
                            }
                        </div>
                    </div>
                </form>
            </div >
        )
    }

    const validate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!activeUser) {
            return
        }

        review.current?.classList.remove('is-valid')
        review.current?.classList.remove('is-invalid')

        rating.current?.classList.remove('is-valid')
        rating.current?.classList.remove('is-invalid')

        if (!form.current?.checkValidity()) {
            form.current?.classList.add('was-validated')
            setSubmitted(false)
        } else {
            form.current?.classList.remove('was-validated')
            setSubmitted(true)
        }
    }

    React.useEffect(() => {
        if (!submitted) {
            return
        }

        const postReview = () => {
            axios.post(process.env.REACT_APP_DOMAIN + `/films/${props.filmId}/reviews`, {
                rating: parseInt(rating.current?.value as string, 10),
                ...(review.current?.value && { review: review.current?.value })
            })
                .then((response) => {
                    navigate(0) // refresh page to load new review
                }, (err) => {
                    console.log(err)
                    setSubmitted(false)

                    switch (err.response.status) {
                        case 400:
                            review.current?.classList.add(((err.response.statusText as string).includes('data/review')) ? 'is-invalid' : 'is-valid')
                            rating.current?.classList.add(((err.response.statusText as string).includes('data/rating')) ? 'is-invalid' : 'is-valid')
                            break;
                        case 403:
                            setPostErrorFlag(true)
                            setPostErrorMessage('Cannot review your own film or post a review on a film that has not been released')
                            break
                        case 401:
                            setPostErrorFlag(true)
                            setPostErrorMessage('Must be signed in to leave a review')
                            break
                        case 404:
                            navigate(-1)
                            break
                        default:
                            setPostErrorFlag(true)
                            setPostErrorMessage(err.response.statusText)
                            break
                    }
                })
        }

        postReview()

    }, [navigate, props.filmId, submitted])


    const reviews_available = () => {
        return (
            <div className="d-flex flex-column col-12">
                <button onClick={toggleExpanded} className='d-flex flex-row bg-light border justify-content-between align-items-center py-2 px-3 rounded-top text-reset text-decoration-none' data-bs-toggle="collapse" data-bs-target="#userReviews" aria-expanded="false" aria-controls="userReviews" id='reviewPanel'>
                    <span className='fs-3'> <i className={'bi bi-caret-' + ((expanded) ? 'down' : 'right')}></i> User Reviews</span>
                    <div className='d-flex flex-column'>
                        {(props.rating) ?
                            <span className='fs-6 fw-light'><span className={'fs-3 fw-semibold pe-1 ' + ((props.rating >= 5) ? 'text-success' : 'text-danger')}>{props.rating}</span>/ 10</span>
                            :
                            <span className='fs-6 fw-light'>Not Rated</span>
                        }

                        <span className='text-muted fs-6'>{reviews.length} review{(reviews.length !== 1) ? 's' : ''}</span>
                    </div>
                </button>

                <div className='collapse' id='userReviews'>
                    <div className='d-flex flex-column col-12 border'>
                        {render_reviews()}
                    </div>
                </div>
                <Restricted blacklist={[props.directorId].concat(reviews.map((review) => review.reviewerId))}>
                    {(postErrorFlag) ?
                        <div className="alert alert-danger" role="alert">
                            {postErrorMessage}
                        </div>
                        : ''}
                    {(reviewsLoaded) ? review_form() : ''}
                </Restricted>
            </div>
        )
    }

    const reviews_unavailable = () => {
        return (
            <div className="d-flex flex-column col-12">
                <span className='d-flex flex-column flex-md-row bg-light border justify-content-between align-items-center py-2 px-3 rounded-top text-reset text-decoration-none' data-bs-toggle="collapse" data-bs-target="#userReviews" aria-expanded="false" aria-controls="userReviews" id='reviewPanel'>
                    <span className='fs-4 text-start'>Reviews are unavailable until the film is released:</span>
                    <div className='d-flex flex-column'>
                        <span className='fs-6 fw-light'><span className={'fs-3 fw-semibold pe-1 '}>{Math.ceil((Date.parse(props.releaseDate) - Date.now()) / (1000 * 3600 * 24)).toLocaleString()}</span> days left</span>
                    </div>
                </span>
            </div>
        )
    }


    return (Date.now() >= Date.parse(props.releaseDate)) ? reviews_available() : reviews_unavailable()
}

export default ReviewsPanel